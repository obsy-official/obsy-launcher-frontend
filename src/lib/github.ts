export interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  browser_download_url: string;
  content_type: string;
  updated_at: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  assets: GitHubAsset[];
}

export interface FormattedAsset {
  name: string;
  type: string;
  ext: string;
  size: string;
  rawBytes: number;
  url: string;
  sigUrl?: string;
  primary?: boolean;
}

export interface PlatformBuild {
  os: "windows" | "mac" | "linux";
  title: string;
  badge: string;
  files: FormattedAsset[];
}

export const GITHUB_OWNER = "obsy-official";
export const GITHUB_REPO = "obsy-launcher";
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
export const GITHUB_LATEST_RELEASE_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "0 Байт";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Байт", "КБ", "МБ", "ГБ"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

let cachedRelease: GitHubRelease | null = null;
const CACHE_KEY = "obsy_gh_release_cache";
const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  if (cachedRelease) return cachedRelease;

  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.timestamp && Date.now() - parsed.timestamp < CACHE_EXPIRY_MS && parsed.data) {
          cachedRelease = parsed.data;
          return parsed.data;
        }
      }
    } catch {
      // ignore storage error
    }
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Obsy-Launcher-Web",
    };

    // Support optional GitHub token if defined in environment
    const token =
      import.meta.env?.GITHUB_TOKEN ||
      (typeof globalThis !== "undefined" && (globalThis as any).process?.env?.GITHUB_TOKEN);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(GITHUB_LATEST_RELEASE_API, { headers });
    if (!res.ok) {
      console.warn(`GitHub API returned status ${res.status}`);
      return cachedRelease;
    }
    const data: GitHubRelease = await res.json();
    cachedRelease = data;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
      } catch {
        // ignore storage error
      }
    }

    return data;
  } catch (err) {
    console.warn("Failed to fetch latest GitHub release:", err);
    return cachedRelease;
  }
}

function determineFileType(fileName: string): {
  type: string;
  ext: string;
  os: "windows" | "mac" | "linux" | "other";
  primary?: boolean;
} {
  const lower = fileName.toLowerCase();

  // Windows
  if (lower.endsWith("-setup.exe") || (lower.endsWith(".exe") && !lower.endsWith(".sig"))) {
    return {
      type: "Инсталлятор (рекомендуется)",
      ext: ".exe",
      os: "windows",
      primary: true,
    };
  }
  if (lower.endsWith(".msi")) {
    return {
      type: "Пакет Windows Installer (.msi)",
      ext: ".msi",
      os: "windows",
    };
  }
  if (lower.endsWith(".zip") && (lower.includes("win") || lower.includes("windows"))) {
    return { type: "Портативная версия (.zip)", ext: ".zip", os: "windows" };
  }

  // macOS
  if (lower.endsWith(".dmg")) {
    if (
      lower.includes("aarch64") ||
      lower.includes("arm64") ||
      lower.includes("m1") ||
      lower.includes("apple")
    ) {
      return {
        type: "Apple Silicon (M1 / M2 / M3 / M4)",
        ext: ".dmg",
        os: "mac",
        primary: true,
      };
    }
    return { type: "Intel Mac (x86_64)", ext: ".dmg", os: "mac" };
  }
  if (lower.endsWith(".app.tar.gz") || lower.endsWith(".tar.gz")) {
    if (lower.includes("aarch64") || lower.includes("arm64")) {
      return {
        type: "macOS Apple Silicon (.app.tar.gz)",
        ext: ".tar.gz",
        os: "mac",
      };
    }
    if (lower.includes("x64") || lower.includes("darwin")) {
      return { type: "macOS Intel (.app.tar.gz)", ext: ".tar.gz", os: "mac" };
    }
  }

  // Linux
  if (lower.endsWith(".appimage")) {
    return {
      type: "Universal AppImage (все дистрибутивы)",
      ext: ".AppImage",
      os: "linux",
      primary: true,
    };
  }
  if (lower.endsWith(".deb")) {
    return { type: "Debian / Ubuntu (.deb)", ext: ".deb", os: "linux" };
  }
  if (lower.endsWith(".rpm")) {
    return {
      type: "Fedora / RHEL / openSUSE (.rpm)",
      ext: ".rpm",
      os: "linux",
    };
  }
  if (lower.endsWith(".tar.gz") && (lower.includes("linux") || lower.includes("tar.gz"))) {
    return { type: "Linux Архив (.tar.gz)", ext: ".tar.gz", os: "linux" };
  }

  return { type: "Дистрибутив", ext: "", os: "other" };
}

export function parsePlatformBuilds(release: GitHubRelease | null): PlatformBuild[] {
  if (!release || !release.assets || release.assets.length === 0) {
    return [
      { os: "windows", title: "Windows", badge: "10 / 11 (64-бит)", files: [] },
      {
        os: "mac",
        title: "macOS",
        badge: "macOS 11.0+ (Big Sur, Sonoma, Sequoia)",
        files: [],
      },
      {
        os: "linux",
        title: "Linux",
        badge: "Ubuntu, Debian, Fedora, Arch, openSUSE",
        files: [],
      },
    ];
  }

  const sigMap = new Map<string, string>();
  release.assets.forEach((asset) => {
    if (asset.name.endsWith(".sig")) {
      const baseName = asset.name.slice(0, -4);
      sigMap.set(baseName, asset.browser_download_url);
    }
  });

  const winFiles: FormattedAsset[] = [];
  const macFiles: FormattedAsset[] = [];
  const linuxFiles: FormattedAsset[] = [];

  release.assets.forEach((asset) => {
    if (
      asset.name.endsWith(".sig") ||
      asset.name === "latest.json" ||
      asset.name.endsWith(".txt") ||
      asset.name.endsWith(".sha256") ||
      asset.name.endsWith(".sha1")
    ) {
      return;
    }

    const info = determineFileType(asset.name);
    let sigUrl = sigMap.get(asset.name);
    if (!sigUrl && info.os === "mac") {
      if (asset.name.includes("aarch64") || asset.name.includes("arm64")) {
        sigUrl = release.assets.find(
          (a) =>
            (a.name.includes("aarch64") || a.name.includes("arm64")) && a.name.endsWith(".sig"),
        )?.browser_download_url;
      } else if (asset.name.includes("x64")) {
        sigUrl = release.assets.find(
          (a) => a.name.includes("x64") && a.name.endsWith(".sig"),
        )?.browser_download_url;
      }
    }

    const formatted: FormattedAsset = {
      name: asset.name,
      type: info.type,
      ext: info.ext,
      size: formatBytes(asset.size),
      rawBytes: asset.size,
      url: asset.browser_download_url,
      sigUrl: sigUrl,
      primary: info.primary,
    };

    if (info.os === "windows") {
      winFiles.push(formatted);
    } else if (info.os === "mac") {
      macFiles.push(formatted);
    } else if (info.os === "linux") {
      linuxFiles.push(formatted);
    }
  });

  // Sort primary files first
  const sortPrimary = (a: FormattedAsset, b: FormattedAsset) =>
    (b.primary ? 1 : 0) - (a.primary ? 1 : 0);
  winFiles.sort(sortPrimary);
  macFiles.sort(sortPrimary);
  linuxFiles.sort(sortPrimary);

  return [
    {
      os: "windows",
      title: "Windows",
      badge: "10 / 11 (64-бит)",
      files: winFiles,
    },
    {
      os: "mac",
      title: "macOS",
      badge: "macOS 11.0+ (Big Sur, Sonoma, Sequoia)",
      files: macFiles,
    },
    {
      os: "linux",
      title: "Linux",
      badge: "Ubuntu, Debian, Fedora, Arch, openSUSE",
      files: linuxFiles,
    },
  ];
}
