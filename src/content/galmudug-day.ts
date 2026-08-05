import type { Locale } from "@/lib/i18n/config";

/**
 * Galmudug Day — 14 August.
 *
 * Galmudug was founded on 14 August 2006; the 15th anniversary was marked in
 * Dhuusamarreeb on 14 August 2021, which fixes the founding year. 14 August
 * 2026 is therefore the 20th anniversary.
 *
 * Note this is a different event from the 2015 reconstitution of Galmudug as
 * a Federal Member State of Somalia — both are real, and the site says so.
 */
export const FOUNDING_YEAR = 2006;

/** Somalia observes EAT (UTC+3) year round, so the day starts at 00:00 +03. */
export function galmudugDayFor(year: number): Date {
  return new Date(`${year}-08-14T00:00:00+03:00`);
}

/** The next 14 August at or after `now`, plus which anniversary it is. */
export function nextGalmudugDay(now: Date = new Date()): {
  date: Date;
  anniversary: number;
  isToday: boolean;
} {
  const year = now.getUTCFullYear();
  const thisYear = galmudugDayFor(year);
  // The celebration runs for the whole of 14 August in Somali time.
  const endOfDay = new Date(thisYear.getTime() + 24 * 60 * 60 * 1000);
  const isToday = now >= thisYear && now < endOfDay;
  const date = now < endOfDay ? thisYear : galmudugDayFor(year + 1);
  return {
    date,
    anniversary: date.getUTCFullYear() - FOUNDING_YEAR,
    isToday,
  };
}

/** Show the homepage countdown banner only in the run-up (and on the day). */
export const COUNTDOWN_WINDOW_DAYS = 45;

export interface Milestone {
  year: string;
  title: Record<Locale, string>;
  body: Record<Locale, string>;
}

/** Factual milestones in Galmudug's history. */
export const MILESTONES: Milestone[] = [
  {
    year: "2006",
    title: {
      en: "Galmudug is founded",
      so: "Aasaaskii Galmudug",
    },
    body: {
      en: "Galmudug is established on 14 August 2006, with Cadaado as its first seat, bringing the Galgaduud region and southern Mudug under one regional administration.",
      so: "Galmudug waxaa la aasaasay 14 Agoosto 2006, iyadoo Cadaado ay ahayd xarunteedii ugu horreysay, waxayna hoos keentay maamul keliya gobolka Galgaduud iyo koonfurta Mudug.",
    },
  },
  {
    year: "2015",
    title: {
      en: "A Federal Member State",
      so: "Dowlad-goboleed federaal ah",
    },
    body: {
      en: "Galmudug is reconstituted as a Federal Member State of Somalia, and the flag in use today — the white chevron with two green stars — is adopted.",
      so: "Galmudug waxaa dib loogu dhisay dowlad-goboleed federaal ah oo ka mid ah Soomaaliya, waxaana la ansixiyay calanka maanta la isticmaalo — saddex-xagalka cad ee laba xiddigood oo cagaaran leh.",
    },
  },
  {
    year: "2020",
    title: {
      en: "Dhuusamarreeb becomes the capital",
      so: "Dhuusamarreeb oo caasimad noqotay",
    },
    body: {
      en: "Dhuusamarreeb settles into its role as the state's seat of government, hosting national talks that repeatedly bring Somalia's federal leaders to the town.",
      so: "Dhuusamarreeb waxay noqotay xarunta dowladda dowlad-goboleedka, waxayna martigelisay wadahadallo qaran oo marar badan hoggaanka federaalka Soomaaliya magaalada keenay.",
    },
  },
  {
    year: "2026",
    title: {
      en: "Twenty years",
      so: "Labaatan sano",
    },
    body: {
      en: "14 August 2026 marks twenty years since the founding — celebrated in Dhuusamarreeb, across the districts, and by the diaspora worldwide.",
      so: "14 Agoosto 2026 waxay calaamadinaysaa labaatan sano oo laga joogo aasaaskii — waxaana lagu xusayaa Dhuusamarreeb, degmooyinka oo dhan, iyo qurbajoogta adduunka ku kala nool.",
    },
  },
];

export interface YearHighlight {
  title: Record<Locale, string>;
  body: Record<Locale, string>;
  /** Where this was reported — every claim on the page is attributable. */
  sourceName: string;
  sourceUrl: string;
}

/**
 * The past year in Galmudug, drawn from published reporting. This is a news
 * retrospective, not a government record: each item links to the outlet that
 * reported it so readers can judge it for themselves.
 */
export const YEAR_HIGHLIGHTS: YearHighlight[] = [
  {
    title: {
      en: "Construction begins at Hobyo port",
      so: "Dhismaha dekedda Hobyo oo bilaabmay",
    },
    body: {
      en: "Work started on the deep-sea port at Hobyo, with cranes and excavators arriving on the coastline and the developer reporting the project on schedule — the largest infrastructure undertaking in the region's history.",
      so: "Waxaa bilaabmay dhismaha dekedda biyo-dheer ee Hobyo, iyadoo wiish iyo qalab qodid xeebta la keenay, horumarinuhuna sheegay in mashruucu jadwalkiisii ku socdo — waana mashruuca kaabayaasha ugu weyn taariikhda gobolka.",
    },
    sourceName: "The Africa Report",
    sourceUrl:
      "https://www.theafricareport.com/409909/somalia-hobyo-port-advances-amid-security-risks-and-ethiopia-trade-scramble/",
  },
  {
    title: {
      en: "$90 million pledged by Galmudug businesspeople",
      so: "90 milyan oo doolar oo ay ballanqaadeen ganacsatada Galmudug",
    },
    body: {
      en: "Galmudug businesspeople pledged roughly $90 million toward the Hobyo port project — financing raised largely from within the region and its diaspora rather than from abroad.",
      so: "Ganacsatada Galmudug waxay ballanqaadeen qiyaastii 90 milyan oo doolar oo lagu taageerayo mashruuca dekedda Hobyo — maalgelin badankeed laga soo ururiyay gobolka iyo qurbajoogtiisa halkii laga keeni lahaa dibadda.",
    },
    sourceName: "Garowe Online",
    sourceUrl:
      "https://www.garoweonline.com/en/news/somalia/galmadug-businessmen-contribute-90-million-for-construction-of-port-in-somalia",
  },
  {
    title: {
      en: "Turkish investment talks",
      so: "Wadahadallo maalgashi oo Turki la yeeshay",
    },
    body: {
      en: "The vice-president and Türkiye's envoy discussed Hobyo port and wider investment opportunities, part of a push to draw outside capital into the region's coastline and free-zone plans.",
      so: "Madaxweyne ku-xigeenka iyo ergayga Turkiga waxay ka wada hadleen dekedda Hobyo iyo fursado maalgashi oo ballaaran, taasoo qayb ka ah dadaal lagu soo jiidanayo maalgelin dibadeed oo lagu horumarinayo xeebta iyo qorshayaasha aagga xorta ah.",
    },
    sourceName: "FTL Somalia",
    sourceUrl:
      "https://www.ftlsomalia.com/vp-eid-turkish-envoy-discuss-hobyo-port-and-investment-opportunities/",
  },
  {
    title: {
      en: "Roads and airport upgrades",
      so: "Waddooyin iyo horumarinta garoonka",
    },
    body: {
      en: "A 60-kilometre road programme around Dhuusamarreeb began, alongside plans to rehabilitate road networks and expand regional airports — the connective work the region's economy has long lacked.",
      so: "Waxaa bilaabmay barnaamij waddo oo 60 kiiloomitir ah oo ku wareegsan Dhuusamarreeb, oo ay weheliyaan qorshayaal lagu dayactirayo shabakadaha waddooyinka lana ballaarinayo garoommada gobolka — hawlaha isku xirka ee dhaqaalaha gobolku muddo dheer u baahnaa.",
    },
    sourceName: "Grokipedia",
    sourceUrl: "https://grokipedia.com/page/Galmudug",
  },
  {
    title: {
      en: "United Nations visit to Dhuusamarreeb",
      so: "Booqasho Qaramada Midoobay oo Dhuusamarreeb ah",
    },
    body: {
      en: "A UN delegation travelled to Dhuusamarreeb to discuss support for and collaboration with Galmudug, reflecting the state's growing role in Somalia's federal picture.",
      so: "Wafdi ka socda Qaramada Midoobay ayaa u safray Dhuusamarreeb si looga wada hadlo taageerada iyo iskaashiga Galmudug, taasoo muujinaysa doorka sii kordhaya ee dowlad-goboleedku ku leeyahay nidaamka federaalka Soomaaliya.",
    },
    sourceName: "UNSOM",
    sourceUrl:
      "https://unsom.unmissions.org/en/un-visit-dhusamareb-focuses-world-body%E2%80%99s-support-and-collaboration-galmudug",
  },
];
