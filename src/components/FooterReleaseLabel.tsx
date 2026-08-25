import React, { useEffect, useState } from "react";
import { fetchLatestRelease, type GitHubRelease } from "@/lib/github";

interface FooterReleaseLabelProps {
  initialRelease?: GitHubRelease | null;
}

export const FooterReleaseLabel: React.FC<FooterReleaseLabelProps> = ({
  initialRelease = null,
}) => {
  const [release, setRelease] = useState<GitHubRelease | null>(initialRelease);

  useEffect(() => {
    fetchLatestRelease().then((data) => {
      if (data) setRelease(data);
    });
  }, []);

  const releaseLabel = release?.tag_name
    ? `Сборка: ${release.tag_name} стабильная`
    : "Сборка: последний стабильный релиз";

  return <span>{releaseLabel}</span>;
};
