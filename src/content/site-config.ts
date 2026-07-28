/**
 * Site-wide configuration the owner edits by hand.
 *
 * SOCIAL_LINKS: add the site's REAL social profiles here and they appear in
 * the top bar and footer automatically. Entries are hidden until a URL is
 * set — we never show placeholder or invented social presence.
 */
export interface SocialLink {
  id: "facebook" | "x" | "youtube" | "instagram" | "telegram" | "tiktok";
  label: string;
  url: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  // { id: "facebook", label: "Facebook", url: "https://www.facebook.com/..." },
  // { id: "x", label: "X", url: "https://x.com/..." },
  // { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@..." },
];

/** Location shown in the top-bar weather chip (Dhusamareb). */
export const WEATHER_LOCATION = {
  latitude: 5.535,
  longitude: 46.386,
  name: { en: "Dhusamareb", so: "Dhuusamarreeb" },
};
