import React, { useState, useEffect, useMemo } from "react";
import {
  Monitor,
  Apple,
  Terminal,
  Download,
  Copy,
  Check,
  Shield,
  ExternalLink,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchLatestRelease,
  parsePlatformBuilds,
  GITHUB_REPO_URL,
  GITHUB_RELEASES_URL,
  type GitHubRelease,
} from "@/lib/github";

interface DownloadMatrixProps {
  initialRelease?: GitHubRelease | null;
}

const getPlatformIcon = (os: string) => {
  switch (os) {
    case "windows":
      return <Monitor className="h-6 w-6 text-blue-400" />;
    case "mac":
      return <Apple className="h-6 w-6 text-slate-200" />;
    case "linux":
      return <Terminal className="h-6 w-6 text-amber-400" />;
    default:
      return <Download className="h-6 w-6 text-white" />;
  }
};

export const DownloadMatrix: React.FC<DownloadMatrixProps> = ({ initialRelease = null }) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [release, setRelease] = useState<GitHubRelease | null>(initialRelease);

  useEffect(() => {
    fetchLatestRelease().then((latest) => {
      if (latest) setRelease(latest);
    });
  }, []);

  const builds = useMemo(() => parsePlatformBuilds(release), [release]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <section id="downloads" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/80">
            <Download className="h-3.5 w-3.5" />
            <span>Официальные релизы GitHub</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Скачать <span className="text-gradient">Obsy Launcher</span>
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Прямые ссылки на бинарные сборки из репозитория{" "}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-slate-200"
            >
              {GITHUB_REPO_URL.replace("https://github.com/", "")}
            </a>
            . Доступны установщики, пакеты и цифровые подписи.
          </p>
        </div>

        {/* 3 Columns for OS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {builds.map((b) => (
            <div
              key={b.os}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-colors hover:border-white/20 sm:p-7"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-sm">
                      {getPlatformIcon(b.os)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{b.title}</h3>
                      <div className="font-mono text-xs text-slate-400">{b.badge}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {b.files.length === 0 ? (
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-slate-400">
                      <span>Сборки загружаются...</span>
                      <a
                        href={GITHUB_RELEASES_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline hover:text-slate-200"
                      >
                        GitHub →
                      </a>
                    </div>
                  ) : (
                    b.files.map((file) => (
                      <div
                        key={file.name}
                        className={`rounded-xl border p-3.5 transition-all ${
                          file.primary
                            ? "border-white/20 bg-white/10 shadow-sm"
                            : "border-white/10 bg-white/[0.02] hover:border-white/15"
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between gap-2.5">
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-bold text-white">{file.type}</div>
                            <div className="truncate font-mono text-[11px] text-slate-400">
                              {file.name}
                            </div>
                          </div>
                          <span className="shrink-0 rounded bg-white/10 px-2 py-0.5 font-mono text-xs whitespace-nowrap text-white/80">
                            {file.size}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            size="sm"
                            asChild
                            className={`h-9 flex-1 gap-1.5 rounded-xl font-semibold ${
                              file.primary
                                ? "bg-white text-black hover:bg-slate-200"
                                : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            }`}
                          >
                            <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                              <Download className="h-3.5 w-3.5" />
                              <span>Скачать {file.ext}</span>
                            </a>
                          </Button>

                          {file.sigUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="Скачать цифровую подпись (.sig)"
                              aria-label="Скачать цифровую подпись .sig"
                              className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                            >
                              <a
                                href={file.sigUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                aria-label={`Скачать цифровую подпись для ${file.name}`}
                              >
                                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                              </a>
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(file.url)}
                            title="Скопировать прямую ссылку на скачивание"
                            aria-label="Скопировать прямую ссылку на скачивание"
                            className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                          >
                            {copiedUrl === file.url ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-slate-400">
                {release?.html_url ? (
                  <a
                    href={release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors hover:text-white"
                  >
                    <span>Релиз: {release.tag_name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span>Последний релиз</span>
                )}
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <Shield className="h-3 w-3" /> Подпись Ed25519
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub Repository Quick Link & All Releases */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md sm:flex-row">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <FileCode className="h-5 w-5 text-white/80" />
            <span>
              Нужна предыдущая версия или ночные сборки? Посетите раздел всех релизов на GitHub.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5 rounded-xl border-white/10 bg-white/5 text-xs font-semibold hover:bg-white/10"
          >
            <a href={GITHUB_RELEASES_URL} target="_blank" rel="noopener noreferrer">
              <span>Все релизы на GitHub</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
