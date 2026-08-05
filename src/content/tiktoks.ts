/**
 * Galmudug Day clips circulating on TikTok.
 *
 * Every entry was verified against TikTok's oEmbed endpoint before being
 * added — it returns author and caption only when the video really exists
 * and is embeddable:
 *   https://www.tiktok.com/oembed?url=<video url>
 *
 * These are user posts, not studio releases: we embed and credit them, and
 * they remain the property of their creators. If a creator takes a video
 * down the embed simply stops rendering — nothing else breaks.
 */
export interface TikTokClip {
  /** Numeric id from the video URL. */
  id: string;
  /** @handle of the creator, as displayed. */
  handle: string;
  /** Display name from oEmbed at time of verification. */
  author: string;
}

export const TIKTOK_CLIPS: TikTokClip[] = [
  { id: "7538268394366323973", handle: "karinkaab", author: "CHEF ABDALA" },
  { id: "7538091163367083270", handle: "miino7x7", author: "Muna star" },
  {
    id: "7538511384619928837",
    handle: "sahromustaph",
    author: "The queendom",
  },
  { id: "7538001730819214599", handle: "hanad_omar", author: "Hanad Omar" },
  { id: "7537425659648314646", handle: "maliboy.252", author: "MALI BOY" },
  { id: "7402713130775645472", handle: "abc4tech", author: "Abc4tech" },
];

export function tiktokUrl(clip: TikTokClip): string {
  return `https://www.tiktok.com/@${clip.handle}/video/${clip.id}`;
}
