import type { OttPlatform } from "../../types";
import { OTT_LABELS, OTT_COLORS } from "../../types";

interface OttBadgeProps {
  platform: OttPlatform;
  size?: "sm" | "md";
}

export function OttBadge({ platform, size = "sm" }: OttBadgeProps) {
  const sizeClasses =
    size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={`inline-flex items-center font-bold rounded-md text-white ${sizeClasses}`}
      style={{ backgroundColor: OTT_COLORS[platform] }}
    >
      {OTT_LABELS[platform]}
    </span>
  );
}
