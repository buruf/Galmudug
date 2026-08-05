import { TIKTOK_CLIPS, tiktokUrl, type TikTokClip } from "@/content/tiktoks";

export interface TikTokPreview extends TikTokClip {
  /** Caption from oEmbed; may be empty if the lookup failed. */
  caption: string;
  /** Poster image from oEmbed. These URLs are signed and expire, so the
   *  gallery always renders a fallback when the image fails to load. */
  thumbnail: string;
}

const REVALIDATE_SECONDS = 60 * 60 * 12;

/**
 * Look up display metadata for one clip.
 *
 * Never throws: a removed video, a rate-limited lookup, or a TikTok outage
 * degrades to the stored handle/author, which is enough to render a card.
 */
async function fetchPreview(clip: TikTokClip): Promise<TikTokPreview> {
  const fallback: TikTokPreview = { ...clip, caption: "", thumbnail: "" };
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl(clip))}`,
      {
        headers: { "user-agent": "GalmudugComAggregator/1.0" },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) return fallback;
    const data = (await res.json()) as {
      title?: string;
      thumbnail_url?: string;
      author_name?: string;
    };
    return {
      ...clip,
      author: data.author_name?.trim() || clip.author,
      caption: (data.title ?? "").trim(),
      thumbnail: data.thumbnail_url ?? "",
    };
  } catch {
    return fallback;
  }
}

/** Previews for the configured clips, fetched in parallel. */
export async function getTikTokPreviews(
  clips: TikTokClip[] = TIKTOK_CLIPS
): Promise<TikTokPreview[]> {
  return Promise.all(clips.map(fetchPreview));
}

/**
 * Strip the hashtag tail TikTok captions usually end with, keeping the
 * human sentence. Returns "" when a caption is nothing but hashtags.
 */
export function cleanCaption(caption: string, max = 90): string {
  const withoutTags = caption
    .replace(/#[\p{L}\p{N}_]+/gu, " ")
    .replace(/@[\p{L}\p{N}_.]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (withoutTags.length <= max) return withoutTags;
  const cut = withoutTags.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trimEnd()}…`;
}
