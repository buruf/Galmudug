import type { ArticleTopic } from "./types";

/**
 * Keyword-based topic classifier, bilingual (English + Somali).
 *
 * Topics are tested in priority order and the first hit wins: sports and
 * culture vocabularies are the most distinctive, so they go first; security
 * outranks politics because Somali coverage often mixes both ("ciidamada
 * dowladda…") and security is the more specific frame; politics last of the
 * specific topics because government words appear in almost everything.
 */
const TOPIC_KEYWORDS: Array<[ArticleTopic, string[]]> = [
  [
    "sports",
    [
      // en
      "football", "soccer", "basketball", "athletics", "marathon", "olympic",
      "tournament", "championship", "league", "stadium", "fifa", "caf",
      "friendly match", "qualifier", "coach", "striker",
      // so
      "ciyaaraha", "ciyaartoy", "kubadda", "kubbadda", "cagta", "koleyga",
      "horyaal", "horyaalka", "tartanka ciyaaraha", "garoonka", "xulka",
      "tababaraha", "kooxda", "ciyaar saaxiibtinimo",
    ],
  ],
  [
    "culture",
    [
      // en
      "culture", "poetry", "poet", "festival", "heritage", "museum",
      "literature", "music", "artist", "singer", "drama", "theatre",
      "tradition", "wedding season", "book fair",
      // so
      "dhaqanka", "dhaqan", "suugaan", "gabay", "gabayaa", "abwaan",
      "heeso", "heesaa", "fanaan", "fanka", "hidde", "hiddaha", "dhaqameed",
      "bandhig faneed", "masraxiyad", "buug",
    ],
  ],
  [
    "business",
    [
      // en
      "business", "economy", "economic", "trade", "market", "investment",
      "bank", "port", "export", "import", "livestock export", "fishing industry",
      "telecom", "energy", "oil", "fuel", "tax", "budget", "inflation",
      // so
      "ganacsi", "ganacsiga", "dhaqaale", "dhaqaalaha", "suuq", "suuqa",
      "maalgashi", "maalgashiga", "bangi", "bangiga", "dekedda", "dhoofinta",
      "xoolaha dhoofinta", "shidaal", "shidaalka", "canshuur", "canshuuraha",
      "miisaaniyad", "miisaaniyadda", "sicir barar", "korontada",
    ],
  ],
  [
    "security",
    [
      // en
      "al-shabaab", "al shabaab", "alshabaab", "attack", "explosion", "blast",
      "bombing", "security forces", "military", "troops", "offensive",
      "operation", "clashes", "gunmen", "killed", "airstrike", "drone strike",
      "piracy", "pirates", "ceasefire",
      // so
      "qarax", "qaraxa", "weerar", "weerarka", "ciidamada", "ciidan",
      "amniga", "amaanka", "dagaal", "dagaalka", "howlgal", "howlgalka",
      "hawlgal", "duqeyn", "duqeynta", "diyaarad aan duuliye lahayn",
      "askari", "askarta", "la wareegay", "xabbad", "isku dhac", "colaad",
      "burcad badeed", "xabad joojin",
    ],
  ],
  [
    "politics",
    [
      // en
      "president", "parliament", "election", "minister", "cabinet",
      "government", "federal", "constitution", "vote", "senate", "governor",
      "mayor", "opposition", "reconciliation", "agreement", "summit",
      "delegation", "ambassador", "prime minister",
      // so
      "madaxweyne", "madaxweynaha", "baarlamaan", "baarlamaanka", "doorasho",
      "doorashada", "doorashooyinka", "wasiir", "wasiirka", "wasiirro",
      "golaha", "gudoomiye", "guddoomiye", "xukuumad", "xukuumadda",
      "dastuur", "dastuurka", "cod bixin", "mucaarad", "heshiis", "heshiiska",
      "wafti", "waftiga", "safiir", "shir madaxeed", "dib u heshiisiin",
      "ra'iisul wasaare", "raysal wasaare",
    ],
  ],
];

const TOPIC_PATTERNS: Array<[ArticleTopic, RegExp[]]> = TOPIC_KEYWORDS.map(
  ([topic, words]) => [
    topic,
    words.map(
      (w) =>
        new RegExp(
          `(?:^|[^\\p{L}])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+")}(?:[^\\p{L}]|$)`,
          "iu"
        )
    ),
  ]
);

export const ARTICLE_TOPICS: ArticleTopic[] = [
  "politics",
  "security",
  "business",
  "sports",
  "culture",
  "general",
];

/** Topics that get their own tab/page (general is the catch-all, no page). */
export const NAV_TOPICS: ArticleTopic[] = [
  "politics",
  "security",
  "business",
  "sports",
  "culture",
];

export function isArticleTopic(value: string): value is ArticleTopic {
  return (ARTICLE_TOPICS as string[]).includes(value);
}

export function classifyTopic(text: string): ArticleTopic {
  for (const [topic, patterns] of TOPIC_PATTERNS) {
    if (patterns.some((re) => re.test(text))) return topic;
  }
  return "general";
}
