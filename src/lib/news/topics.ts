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
        "friendly match", "goalkeeper", "uefa", "caf ", "afcon",
        "arsenal", "chelsea", "liverpool", "manchester united",
        "manchester city", "real madrid", "barcelona", "juventus",
        "transfer window", "midfielder",
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
    "health",
    {
      strong: [
        // en
        "cholera", "measles", "malaria", "polio", "tuberculosis",
        "vaccination", "vaccine", "outbreak", "epidemic", "malnutrition",
        "hospital", "clinic", "health ministry",
        // so
        "caafimaad", "caafimaadka", "isbitaal", "isbitaalka", "isbitaalada",
        "cudur", "cudurka", "cudurro", "cudurrada", "tallaal", "tallaalka",
        "daacuun", "daacuunka", "jadeeco", "duumo", "duumada",
        "nafaqo darro", "nafaqada", "dhakhtar", "dhakhtarka", "dhakhaatiirta",
        "xanuun", "xanuunka", "dawo", "dawooyin", "dawooyinka",
      ],
      weak: [
        "disease", "patients", "medical", "nurses", "treatment", "doctors",
        "bukaan", "bukaanka", "daaweyn", "daaweynta", "kalkaaliye",
        "caafimaadka bulshada",
      ],
    },
  ],
  [
    "education",
    {
      strong: [
        // en
        "school", "schools", "university", "universities", "students",
        "teachers", "curriculum", "scholarship", "classroom", "literacy",
        "education ministry", "exam", "exams",
        // so
        "waxbarasho", "waxbarashada", "dugsi", "dugsiga", "dugsiyada",
        "jaamacad", "jaamacadda", "jaamacadaha", "arday", "ardayda",
        "macallin", "macallimiin", "macallimiinta", "imtixaan", "imtixaanka",
        "imtixaannada", "manhaj", "manhajka", "deeq waxbarasho",
        "fasal", "fasalka", "qalin jabin", "qalin-jabin",
      ],
      weak: [
        "college", "graduates", "training", "pupils", "learning",
        "tababar", "tababarka", "aqoonta", "barnaamij waxbarasho",
      ],
    },
  ],
  [
    "environment",
    {
      strong: [
        // en
        "drought", "famine", "flood", "flooding", "floods", "climate change",
        "locusts", "deforestation", "desertification", "cyclone",
        // so
        "abaar", "abaarta", "abaaraha", "fatahaad", "fatahaadda",
        "daadad", "daadadka", "roobab", "roobabka", "isbeddelka cimilada",
        "cimilada", "ayaxa", "dhuxusha", "biyo la'aan", "biyo-la'aan",
        "gaajo", "gaajada", "macluul", "duufaan", "duufaanta",
        "oomane", "harraad",
      ],
      weak: [
        "environment", "water shortage", "displacement", "humanitarian",
        "rainfall", "livestock deaths",
        "biyaha", "barakac", "barakacayaasha", "gargaar", "gargaarka",
        "xoolaha", "daaqa",
      ],
    },
  ],
  [
    "diaspora",
    {
      strong: [
        // en
        "diaspora", "remittance", "remittances", "refugees", "asylum",
        "deportation", "deported", "resettlement", "migrants",
        // so
        "qurbajoog", "qurbajoogta", "qurba joogta", "xawilaad", "xawaalad",
        "xawilaadda", "qaxooti", "qaxootiga", "musaafiriin", "tahriib",
        "tahriibka", "magangelyo", "magangelyada", "la masaafuriyay",
      ],
      weak: [
        "abroad", "overseas", "visa", "expatriate", "immigration",
        "dibadda", "safaarad", "safaaradda", "fiiso", "socdaal",
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
        "qarax*", "weerar*", "ciidan*", "ciidam*", "howlgal*", "hawlgal*",
        "duqeyn*", "duqeeyay", "burcad badeed", "xabad joojin", "isku dhac",
        "colaad*", "dagaal*", "amniga", "amaanka", "argagixiso*",
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
        // en — international/diplomatic coverage, which is a large share of
        // the English-language wire and previously scored nothing.
        "foreign minister", "foreign ministers", "bilateral", "african union",
        "united nations", "diplomatic", "envoy", "condemns", "condemned",
        "executive council", "state visit", "communique", "sanctions",
        // so
        "madaxweyn*", "baarlamaan*", "doorasho*", "musharrax*", "wasiir*",
        "xukuumad*", "dastuur*", "mucaarad*",
        "ra'iisul wasaare", "raysal wasaare", "shir madaxeed",
        "dib u heshiisiin", "gudoomiye", "guddoomiye",
        "xildhibaan", "xildhibaanada", "xildhibaannada", "golaha wasiirrada",
        "aqalka sare", "aqalka hoose", "siyaasad", "siyaasadda",
      ],
      weak: [
        "government", "federal", "vote", "delegation", "agreement", "minister",
        "senator", "lawmakers", "talks", "diplomatic",
        "golaha", "heshiis", "heshiiska", "wafti", "waftiga", "safiir",
        "dowladda", "maamulka", "cod bixin", "guddiga", "wada hadal",
        "wada-hadallo", "kulan", "kulanka",
      ],
    },
  ],
];

/**
 * Bumped whenever the vocabularies or scoring change. Stored articles carry
 * the version they were filed under; the pipeline re-classifies anything
 * stamped with an older one, so a vocabulary fix repairs the whole archive
 * on the next run instead of only affecting newly-arriving stories.
 *
 *   1 — original first-match-wins matcher
 *   2 — scoring matcher; added health/education/environment/diaspora
 */
export const CLASSIFIER_VERSION = 2;

/** A topic needs this much evidence before a story leaves "general". */
const MIN_SCORE = 2;
const STRONG_WEIGHT = 2;
const WEAK_WEIGHT = 1;

/**
 * Build a matcher for one keyword.
 *
 * A trailing "*" marks a STEM: Somali is heavily suffixed, so one noun
 * appears as weerar / weerarka / weerarrada / weerarradii, and exact-word
 * matching missed most of those inflections (a large share of the stories
 * that were stuck in "general"). A stem matches the word plus up to a few
 * trailing letters, which covers the usual case endings without matching
 * unrelated longer words. Only use stems on distinctive roots — short or
 * common ones (e.g. "dad") would over-match.
 */
function toPattern(word: string): RegExp {
  const isStem = word.endsWith("*");
  const base = isStem ? word.slice(0, -1) : word;
  const escaped = base
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/ /g, "\\s+");
  const tail = isStem ? "\\p{L}{0,6}" : "";
  return new RegExp(`(?:^|[^\\p{L}])${escaped}${tail}(?:[^\\p{L}]|$)`, "iu");
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
  "health",
  "education",
  "environment",
  "diaspora",
  "sports",
  "culture",
  "general",
];

/** Topics that get their own tab/page (general is the catch-all, no page). */
export const NAV_TOPICS: ArticleTopic[] = [
  "politics",
  "security",
  "business",
  "health",
  "education",
  "environment",
  "diaspora",
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
