import type { SyntheticEvent } from "react";

export function fallbackAvatarUrl(name?: string | null, email?: string | null) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email || "User")}&background=0D8ABC&color=fff&size=128`;
}

export function handleAvatarError(
  event: SyntheticEvent<HTMLImageElement, Event>,
  name?: string | null,
  email?: string | null,
) {
  const fallback = fallbackAvatarUrl(name, email);
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.src = fallback;
  }
}
