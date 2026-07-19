/**
 * Maintenance: re-run language detection and (keyword) category
 * classification over the stored articles. Useful after improving
 * classify.ts so the existing store benefits, not just new fetches.
 *
 * Admin-forced state is respected: forceCategory sources keep their
 * category, and hidden/pinned flags are untouched.
 *
 * Run: npx tsx scripts/retag-articles.ts
 */
import { getArticleStore } from "../src/lib/news/store";
import { classifyCategory, detectLanguage } from "../src/lib/news/classify";
import { classifyTopic } from "../src/lib/news/topics";
import { getSource } from "../src/lib/news/sources";

async function main() {
  const store = getArticleStore();
  const articles = await store.getAll();

  let changed = 0;
  for (const a of articles) {
    const source = getSource(a.sourceId);
    const text = `${a.title} ${a.summary}`;
    const language = detectLanguage(text, source?.language ?? a.language);
    const category =
      source?.forceCategory ?? classifyCategory(a.title, a.summary);
    const topic = classifyTopic(text);

    if (language !== a.language || category !== a.category || topic !== a.topic) {
      console.log(
        `retag [${a.sourceName}] lang ${a.language}->${language}, cat ${a.category}->${category}, topic ${a.topic ?? "-"}->${topic}: ${a.title.slice(0, 70)}`
      );
      a.language = language;
      a.category = category;
      a.topic = topic;
      changed++;
    }
  }

  await store.replaceAll(articles);
  console.log(`\n${changed} article(s) retagged out of ${articles.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
