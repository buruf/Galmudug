import type { ArticleCategory, ArticleLanguage } from "./types";

/**
 * Place names and terms that mark a story as Galmudug-regional.
 * Includes common English and Somali spellings (Somali orthography uses
 * c/x/q where English transliterations often don't).
 */
const GALMUDUG_KEYWORDS = [
  "galmudug",
  "galmudugh",
  "galgaduud",
  "galgadud",
  "mudug",
  // Dhusamareb
  "dhusamareb",
  "dhusamareeb",
  "dhuusamarreeb",
  "dhuusamareeb",
  "dusamareb",
  // Galkayo
  "galkayo",
  "galkacyo",
  "gaalkacyo",
  "galkaio",
  "galkaacyo",
  // Hobyo
  "hobyo",
  "obbia",
  // Adado
  "adado",
  "cadaado",
  "adaado",
  // Abudwak
  "abudwak",
  "caabudwaaq",
  "abudwaq",
  "caabudwaq",
  // Harardhere
  "harardhere",
  "xarardheere",
  "harardheere",
  // El Buur / El Dher
  "el buur",
  "elbuur",
  "ceelbuur",
  "ceel buur",
  "el bur",
  "eldheer",
  "ceeldheer",
  "el dher",
  // Guriel
  "guriel",
  "guriceel",
  "gurieel",
  // Other Galmudug towns
  "balanbale",
  "balanballe",
  "bandiiradley",
  "bandiradley",
  "mataban",
  "wisil",
  "xingod",
  "hindhere",
  "galhareri",
  "ceelhuur",
  "el huur",
  "hurshe",
  "docoley",
  "wabxo",
  "camaara",
  "amara",
  "qeycad",
  "baxdo",
  "masagawaa",
] as const;

const KEYWORD_PATTERNS = GALMUDUG_KEYWORDS.map(
  (k) => new RegExp(`(?:^|[^\\p{L}])${k.replace(/ /g, "\\s+")}(?:[^\\p{L}]|$)`, "iu")
);

/** Somali function words that essentially never appear as English words. */
const SOMALI_MARKERS = new Set([
  "iyo",
  "oo",
  "ayaa",
  "ayey",
  "ayay",
  "waa",
  "wuxuu",
  "waxay",
  "waxaa",
  "uu",
  "ee",
  "ka",
  "ku",
  "soo",
  "loo",
  "lagu",
  "laga",
  "inuu",
  "inay",
  "kadib",
  "kadibna",
  "iyada",
  "isagoo",
  "iyadoo",
  "maamulka",
  "dowladda",
  "xukuumadda",
  "ciidamada",
  "magaalada",
  "gobolka",
  "degmada",
  "shacabka",
  "madaxweynaha",
  "wasiirka",
  "kulan",
  "kala",
  "dhexeeya",
  "sheegay",
  "yiri",
  "maanta",
  "shalay",
  "dekadda",
  "shirka",
  "shirkii",
  "taliska",
  "taliyaha",
  "saldhigga",
  "wasaaradda",
  "wasaaradaha",
  "guddiga",
  "dadweynaha",
  "howlgal",
  "howlgalka",
  "booqasho",
  "booqashadii",
  "xoghayaha",
  "agaasimaha",
]);

/** English function words, for the reverse check on Somali-default sources. */
const ENGLISH_MARKERS = new Set([
  "the",
  "and",
  "of",
  "in",
  "to",
  "for",
  "with",
  "on",
  "as",
  "at",
  "from",
  "after",
  "over",
  "new",
  "says",
]);

export function isGalmudugStory(text: string): boolean {
  return KEYWORD_PATTERNS.some((re) => re.test(text));
}

export function classifyCategory(title: string, summary: string): ArticleCategory {
  return isGalmudugStory(`${title} ${summary}`) ? "galmudug" : "somalia";
}

/**
 * Detect item language: if two or more distinct Somali marker words appear,
 * tag as Somali; otherwise fall back to the source's default language.
 */
export function detectLanguage(
  text: string,
  sourceDefault: ArticleLanguage
): ArticleLanguage {
  const tokens = text
    .toLowerCase()
    .split(/[^\p{L}']+/u)
    .filter(Boolean);
  const hits = new Set<string>();
  for (const t of tokens) {
    if (SOMALI_MARKERS.has(t)) hits.add(t);
    if (hits.size >= 2) return "so";
  }
  // A single strong marker in a short headline still counts.
  if (hits.size === 1 && tokens.length <= 8) return "so";

  // Reverse check: clearly English text from a Somali-default source.
  if (hits.size === 0 && sourceDefault === "so") {
    const englishHits = new Set<string>();
    for (const t of tokens) {
      if (ENGLISH_MARKERS.has(t)) englishHits.add(t);
      if (englishHits.size >= 2) return "en";
    }
  }
  return sourceDefault;
}
