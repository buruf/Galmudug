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

/**
 * Google AdSense publisher id, e.g. "ca-pub-1234567890123456".
 *
 * Set NEXT_PUBLIC_ADSENSE_CLIENT in the Vercel project to switch ads on.
 * While it is unset, no AdSense script loads and every <AdSlot> renders
 * nothing — so the site stays clean (and fast) until you are approved.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/**
 * Ad unit slot ids created in the AdSense dashboard. Leave a value empty to
 * hide that placement. Names map to where they appear on the site.
 */
export const AD_SLOTS = {
  /** Below the lead story / above the main article grid. */
  homeTop: process.env.NEXT_PUBLIC_AD_SLOT_HOME_TOP ?? "",
  /** In the homepage right-hand column, under the top stories. */
  sidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR ?? "",
  /** Between article blocks on the news/topic feeds. */
  feed: process.env.NEXT_PUBLIC_AD_SLOT_FEED ?? "",
};

export const adsEnabled = (): boolean => ADSENSE_CLIENT.startsWith("ca-pub-");

/**
 * Official Galmudug State and district channels.
 *
 * These are OUTBOUND references, not this site's own accounts: galmudug.com
 * is independent and not affiliated with any government body. They are listed
 * on the About page, under the independence notice, so readers who want
 * official information can reach it directly. Never move these into
 * SOCIAL_LINKS — those render as "follow us" and would imply the site is
 * government-run.
 */
export interface OfficialLink {
  label: string;
  url: string;
  kind: "facebook" | "website";
}

export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    label: "Galmudug State (Facebook)",
    url: "https://www.facebook.com/state.galmudug",
    kind: "facebook",
  },
  {
    label: "Galmudug State House",
    url: "https://statehouse.gm.so",
    kind: "website",
  },
  {
    label: "Ministry of Information",
    url: "https://www.moi.gm.so",
    kind: "website",
  },
  {
    label: "Cadaado District",
    url: "https://cadaado.gm.so",
    kind: "website",
  },
];

/**
 * Towns cycled through by the top-bar weather chip. All are in Galmudug
 * (Galgaduud + southern Mudug); one fetch per town, cached 30 minutes, and
 * the chip rotates between them client-side.
 */
export interface WeatherCity {
  latitude: number;
  longitude: number;
  name: { en: string; so: string };
}

export const WEATHER_CITIES: WeatherCity[] = [
  { latitude: 5.535, longitude: 46.386, name: { en: "Dhusamareb", so: "Dhuusamarreeb" } },
  { latitude: 6.77, longitude: 47.43, name: { en: "Galkayo", so: "Gaalkacyo" } },
  { latitude: 6.13, longitude: 46.64, name: { en: "Adado", so: "Cadaado" } },
  { latitude: 5.35, longitude: 48.53, name: { en: "Hobyo", so: "Hobyo" } },
  { latitude: 5.32, longitude: 46.42, name: { en: "Guriel", so: "Guriceel" } },
  { latitude: 4.69, longitude: 46.62, name: { en: "El Buur", so: "Ceelbuur" } },
  { latitude: 4.65, longitude: 47.86, name: { en: "Harardhere", so: "Xarardheere" } },
  { latitude: 6.12, longitude: 45.86, name: { en: "Abudwak", so: "Caabudwaaq" } },
  { latitude: 6.42, longitude: 47.0, name: { en: "Wisil", so: "Wisil" } },
  { latitude: 5.0, longitude: 46.9, name: { en: "El Dher", so: "Ceeldheer" } },
];
