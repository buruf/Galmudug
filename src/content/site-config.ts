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
