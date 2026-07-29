import type { ArticleTopic } from "./types";

/**
 * Keyword topic classifier, bilingual (English + Somali).
 *
 * Scoring, not first-match-wins. Each topic has STRONG terms (unambiguous —
 * one is enough) and WEAK terms (suggestive but also common in unrelated
 * copy — two are needed, or one alongside another weak hit). The highest
 * scoring topic wins; anything below the threshold stays "general".
 *
 * This replaced a first-match-wins matcher that mis-filed large numbers of
 * stories, because Somali has several words whose everyday meaning collides
 * with a topic vocabulary:
 *   - "kooxda"   = a football *team* but also an armed *group*, so militant
 *                  stories landed in Sports;
 *   - "garoonka" = a *pitch* but also an *airport* ("garoonka diyaaradaha");
 *   - "cagta"    = *foot*, only meaningful here as "kubadda cagta" (football);
 *   - "culture"  = fine in isolation, but it appears inside the name of the
 *                  Ministry of Information, Culture and Tourism, which put
 *                  routine ministerial news into Culture.
 * Those terms are now either scoped to a phrase or demoted to weak.
 */
type Keywords = { strong: string[]; weak: string[] };

const TOPIC_KEYWORDS: Array<[ArticleTopic, Keywords]> = [
  [
    "sports",
    {
      strong: [
        // en
        "football", "soccer", "basketball", "olympic", "olympics", "marathon",
        "fifa", "premier league", "champions league", "world cup",
        "friendly match", "goalkeeper",
        // so — "kubadda cagta" is the phrase for football; the bare words are
        // not (see the note above).
        "kubadda cagta", "kubbadda cagta", "kubadda koleyga",
        "ciyaaraha", "ciyaartoy", "ciyaartoyga", "ciyaartoyda",
        "horyaalka", "horyaalkii", "tartanka ciyaaraha", "goolhaye",
        "garoonka kubadda", "kooxda kubadda",
      ],
      weak: [
        "athletics", "tournament", "championship", "league", "stadium",
        "qualifier", "coach", "striker", "midfielder",
        "kubadda", "kubbadda", "tababaraha", "xulka", "koobka", "guusha",
      ],
    },
  ],
  [
    "culture",
    {
      strong: [
        // en
        "poetry", "poet", "heritage", "museum", "literature", "folklore",
        "traditional dance", "book fair", "art exhibition",
        // so
        "suugaan", "suugaanta", "gabay", "gabayaa", "abwaan", "abwaanka",
        "heesaa", "fanaan", "fanaanka", "fannaan", "masraxiyad",
        "dhaqan soomaaliyeed", "hiddaha iyo dhaqanka", "bandhig faneed",
      ],
      weak: [
        "culture", "cultural", "festival", "music", "artist", "singer",
        "drama", "theatre", "tradition",
        "dhaqanka", "dhaqameed", "hidde", "hiddaha", "heeso", "fanka", "buug",
      ],
    },
  ],
  [
    "business",
    {
      strong: [
        // en
        "economy", "economic", "investment", "trade deal", "central bank",
        "inflation", "budget", "livestock export", "fisheries",
        // so
        "ganacsi", "ganacsiga", "dhaqaale", "dhaqaalaha", "maalgashi",
        "maalgashiga", "bangiga", "bangiyada", "canshuur", "canshuuraha",
        "miisaaniyad", "miisaaniyadda", "sicir barar", "dhoofinta",
        "suuqa ganacsiga",
      ],
      weak: [
        "business", "trade", "market", "bank", "port", "export", "import",
        "telecom", "energy", "oil", "fuel", "tax",
        "suuq", "dekedda", "shidaal", "shidaalka", "korontada", "lacag",
      ],
    },
  ],
  [
    "security",
    {
      strong: [
        // en
        "al-shabaab", "al shabaab", "alshabaab", "airstrike", "drone strike",
        "explosion", "bombing", "suicide bomber", "security forces",
        "offensive", "ceasefire", "piracy", "pirates", "militants",
        // so
        // Somali inflects verbs heavily, so the common conjugations of
        // "weerar" (attack) are listed alongside the noun.
        "qarax", "qaraxa", "weerar", "weerarka", "weerarro", "weerarrada",
        "weeraray", "weerartay", "weeraraya", "weeraren",
        "ciidamada", "ciidanka",
        "howlgal", "howlgalka", "hawlgal", "duqeyn", "duqeynta", "duqeeyay",
        "burcad badeed", "xabad joojin", "isku dhac", "colaad", "dagaal",
        "dagaalka", "amniga", "amaanka",
      ],
      weak: [
        "attack", "blast", "military", "troops", "clashes", "gunmen",
        "killed", "wounded", "operation",
        "askari", "askarta", "xabbad", "la wareegay", "argagixiso",
      ],
    },
  ],
  [
    "politics",
    {
      strong: [
        // en
        "president", "parliament", "election", "prime minister", "cabinet",
        "constitution", "senate", "opposition", "reconciliation", "summit",
        "ambassador", "governor", "mayor",
        // so
        "madaxweyne", "madaxweynaha", "baarlamaan", "baarlamaanka",
        "doorasho", "doorashada", "doorashooyinka", "musharrax",
        "musharraxa", "wasiir", "wasiirka", "xukuumad", "xukuumadda",
        "dastuur", "dastuurka", "mucaarad", "mucaaradka",
        "ra'iisul wasaare", "raysal wasaare", "shir madaxeed",
        "dib u heshiisiin", "gudoomiye", "guddoomiye",
      ],
      weak: [
        "government", "federal", "vote", "delegation", "agreement", "minister",
        "golaha", "heshiis", "heshiiska", "wafti", "waftiga", "safiir",
        "dowladda", "maamulka", "cod bixin",
      ],
    },
  ],
];

/** A topic needs this much evidence before a story leaves "general". */
const MIN_SCORE = 2;
const STRONG_WEIGHT = 2;
const WEAK_WEIGHT = 1;

function toPattern(word: string): RegExp {
  const escaped = word
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/ /g, "\\s+");
  return new RegExp(`(?:^|[^\\p{L}])${escaped}(?:[^\\p{L}]|$)`, "iu");
}

const TOPIC_PATTERNS: Array<[ArticleTopic, { strong: RegExp[]; weak: RegExp[] }]> =
  TOPIC_KEYWORDS.map(([topic, { strong, weak }]) => [
    topic,
    { strong: strong.map(toPattern), weak: weak.map(toPattern) },
  ]);

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

/** Score one topic against the text. Exported for diagnostics and tests. */
export function scoreTopic(text: string, topic: ArticleTopic): number {
  const entry = TOPIC_PATTERNS.find(([t]) => t === topic);
  if (!entry) return 0;
  const [, { strong, weak }] = entry;
  const strongHits = strong.filter((re) => re.test(text)).length;
  const weakHits = weak.filter((re) => re.test(text)).length;
  return strongHits * STRONG_WEIGHT + weakHits * WEAK_WEIGHT;
}

export function classifyTopic(text: string): ArticleTopic {
  let best: ArticleTopic = "general";
  let bestScore = 0;
  // Ties keep the earlier topic in TOPIC_KEYWORDS order, which puts the more
  // specific vocabularies (sports, culture) ahead of the broad ones.
  for (const [topic] of TOPIC_PATTERNS) {
    const score = scoreTopic(text, topic);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }
  return bestScore >= MIN_SCORE ? best : "general";
}
