import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Apple,
  Check,
  ChevronDown,
  Download,
  Monitor,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { fetchLatestRelease, parsePlatformBuilds, type GitHubRelease } from "@/lib/github";

export interface PlatformOption {
  id: string;
  name: string;
  os: "windows" | "mac" | "linux";
  arch?: string;
  ext: string;
  filename: string;
  size: string;
  url: string;
  icon: React.ReactNode;
  recommended?: boolean;
}

interface DownloadDropdownProps {
  initialRelease?: GitHubRelease | null;
}

function buildsToPlatformOptions(release: GitHubRelease | null): PlatformOption[] {
  const platformBuilds = parsePlatformBuilds(release);
  const options: PlatformOption[] = [];

  const getIcon = (os: "windows" | "mac" | "linux") => {
    switch (os) {
      case "windows":
        return <Monitor className="h-4 w-4 text-blue-400" />;
      case "mac":
        return <Apple className="h-4 w-4 text-slate-200" />;
      case "linux":
        return <Terminal className="h-4 w-4 text-amber-400" />;
    }
  };

  platformBuilds.forEach((build) => {
    build.files.forEach((file, idx) => {
      // Don't duplicate tar.gz if .dmg is available for macOS dropdown
      if (
        build.os === "mac" &&
        file.ext === ".tar.gz" &&
        build.files.some((f) => f.ext === ".dmg")
      ) {
        return;
      }

      options.push({
        id: `${build.os}-${idx}-${file.ext}`,
        name: `${build.title} — ${file.type}`,
        os: build.os,
        ext: file.ext,
        filename: file.name,
        size: file.size,
        url: file.url,
        icon: getIcon(build.os),
        recommended: file.primary,
      });
    });
  });

  return options;
}

export const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ initialRelease = null }) => {
  const [release, setRelease] = useState<GitHubRelease | null>(initialRelease);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    fetchLatestRelease().then((data) => {
      if (data) setRelease(data);
    });
  }, []);

  const platforms = useMemo(() => buildsToPlatformOptions(release), [release]);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption | null>(null);

  // Pick default recommendation based on OS
  useEffect(() => {
    if (platforms.length === 0) return;

    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.includes("mac")) {
        const macApple = platforms.find((p) => p.os === "mac" && p.recommended);
        setSelectedPlatform(macApple || platforms.find((p) => p.os === "mac") || platforms[0]);
      } else if (userAgent.includes("linux")) {
        const linuxApp = platforms.find((p) => p.os === "linux" && p.recommended);
        setSelectedPlatform(linuxApp || platforms.find((p) => p.os === "linux") || platforms[0]);
      } else {
        const win = platforms.find((p) => p.os === "windows" && p.recommended);
        setSelectedPlatform(win || platforms.find((p) => p.os === "windows") || platforms[0]);
      }
    } else {
      setSelectedPlatform(platforms[0]);
    }
  }, [platforms]);

  const activePlatform = selectedPlatform || platforms[0];

  const handleDownload = (platform: PlatformOption) => {
    setSelectedPlatform(platform);
    setDownloadSuccess(true);

    if (platform.url && platform.url !== "#") {
      const link = document.createElement("a");
      link.href = platform.url;
      link.download = platform.filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  if (!activePlatform) {
    return (
      <div className="flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 font-mono text-xs text-slate-300">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
        <span>Загрузка актуального релиза...</span>
        <a
          href="https://github.com/obsy-official/obsy-launcher/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 font-sans font-semibold text-white underline hover:text-slate-200"
        >
          Смотреть на GitHub →
        </a>
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      {/* Primary White Button */}
      <div className="inline-flex overflow-hidden rounded-xl border border-white/20 shadow-2xl">
        <Button
          size="lg"
          onClick={() => handleDownload(activePlatform)}
          className="flex h-14 items-center gap-3 rounded-none border-0 bg-white px-7 text-sm font-bold text-black hover:bg-slate-200 sm:text-base"
        >
          {downloadSuccess ? (
            <Check className="h-5 w-5 animate-bounce text-emerald-600" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          <div className="flex flex-col text-left">
            <span className="leading-tight font-bold">
              {downloadSuccess
                ? "Загрузка началась..."
                : `Скачать для ${activePlatform.os === "windows" ? "Windows" : activePlatform.os === "mac" ? "macOS" : "Linux"}`}
            </span>
            <span className="font-mono text-[11px] font-normal text-black/60">
              {activePlatform.filename} ({activePlatform.size})
            </span>
          </div>
        </Button>

        {/* Dropdown Menu Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="flex h-14 items-center justify-center rounded-none border-0 border-l border-black/10 bg-white/90 px-3.5 text-black transition-colors hover:bg-slate-200"
              aria-label="Выбрать другую платформу"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80 border-white/10 bg-[#0a0a0a]/95 p-2 sm:w-96"
            align="end"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 font-mono text-[10px] text-slate-400">
              <span>Доступные сборки {release?.tag_name || ""}</span>
              <span className="flex items-center gap-1 font-sans text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Без вирусов
              </span>
            </div>

            <div className="max-h-72 space-y-1 overflow-y-auto py-1.5">
              {platforms.map((p) => {
                const isCurrent = activePlatform.id === p.id;
                return (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => handleDownload(p)}
                    className={`flex items-center justify-between rounded-xl p-2.5 ${
                      isCurrent ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                        {p.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span>{p.name}</span>
                          {p.recommended && (
                            <span className="py-0.2 rounded bg-emerald-500/20 px-1.5 font-mono text-[9px] text-emerald-400">
                              авто
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">{p.filename}</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-slate-400">{p.size}</span>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Secondary Button */}
      <Button
        variant="outline"
        size="lg"
        asChild
        className="h-14 gap-2 rounded-xl border-white/10 bg-white/5 font-medium text-white hover:bg-white/10"
      >
        <a href="#downloads">
          <Sparkles className="h-4 w-4 text-white/80" />
          <span>Все сборки и исходный код</span>
        </a>
      </Button>
    </div>
  );
};
