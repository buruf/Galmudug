/**
 * Manual/local news-pipeline run: `npm run fetch:news`
 * Prints a per-source report so a failing feed is easy to spot.
 */
import { runNewsPipeline } from "../src/lib/news/pipeline";

runNewsPipeline()
  .then((report) => {
    console.log("\n=== Pipeline report ===");
    console.log(`Ran at:   ${report.ranAt}`);
    console.log(`Fetched:  ${report.fetched} items`);
    console.log(`Added:    ${report.added} new articles`);
    console.log(`In store: ${report.totalInStore}`);
    console.log("\nPer source:");
    for (const s of report.sources) {
      const status = s.ok ? "OK " : "FAIL";
      console.log(
        `  [${status}] ${s.sourceId.padEnd(16)} ${s.method.padEnd(6)} ${s.itemCount} items${s.error ? ` — ${s.error}` : ""}`
      );
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Pipeline failed:", err);
    process.exit(1);
  });
