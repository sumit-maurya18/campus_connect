export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase();
}

export function relativeTime(dateStr?: string | null): string {

  if (!dateStr) return "Recently";

  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000
  );

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });
}

export function locationLabel(city?: string | null, style?: string | null) {

  if (city && style) return `${city} · ${style}`;

  return city || style || "Location not specified";
}

export function formatStipend(stipend?: string | null): string {

  if (!stipend) return "Unknown";

  const lower = stipend.toLowerCase();

  if (lower === "unpaid" || lower === "0")
    return "Unpaid";

  const parts = stipend.split(/[-–]/);

  if (parts.length === 2) {

    const a = parseInt(parts[0]);
    const b = parseInt(parts[1]);

    if (!isNaN(a) && !isNaN(b))
      return `${(a/1000).toFixed(0)}K – ${(b/1000).toFixed(0)}K/mo`;
  }

  const n = parseInt(stipend);

  if (!isNaN(n))
    return `${(n/1000).toFixed(0)}K/mo`;

  return stipend;
}