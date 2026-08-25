import React, { useEffect, useState } from "react";
import { fetchLatestRelease, type GitHubRelease } from "@/lib/github";

interface HeroReleaseBadgeProps {
  initialRelease?: GitHubRelease | null;
}

export const HeroReleaseBadge: React.FC<HeroReleaseBadgeProps> = ({ initialRelease = null }) => {
  const [release, setRelease] = useState<GitHubRelease | null>(initialRelease);

  useEffect(() => {
    fetchLatestRelease().then((data) => {
      if (data) setRelease(data);
    });
  }, []);

  const releaseBadgeText = release?.tag_name
    ? `Релиз ${release.tag_name} — Windows, macOS, Linux`
    : "Релиз доступен для Windows, macOS и Linux";

  return (
    <a
      href="#downloads"
      className="group mb-8 inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-inner backdrop-blur-md transition-all hover:border-white/20"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </span>
      <span className="text-xs font-semibold text-slate-300 transition-colors group-hover:text-white">
        {releaseBadgeText}
      </span>
      <span className="border-l border-white/10 pl-1 text-[11px] text-slate-400">Скачать →</span>
    </a>
  );
};
