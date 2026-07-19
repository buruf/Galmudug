import type { Locale } from "@/lib/i18n/config";

export type Bilingual = Record<Locale, string>;
export type BilingualParagraphs = Record<Locale, string[]>;

export interface District {
  slug: string;
  name: Bilingual;
  /** Name in the other spelling tradition, shown as a subtitle. */
  altName: string;
  region: Bilingual;
  population: string;
  role: Bilingual;
  body: BilingualParagraphs;
}

export const DISTRICTS: District[] = [
  {
    slug: "dhusamareb",
    name: { en: "Dhusamareb", so: "Dhuusamarreeb" },
    altName: "Dhuusamarreeb",
    region: { en: "Galgaduud", so: "Galgaduud" },
    population: "~70,000",
    role: {
      en: "Interim state capital and seat of the Galmudug administration",
      so: "Caasimadda ku-meel-gaarka ah iyo xarunta maamulka Galmudug",
    },
    body: {
      en: [
        "Dhusamareb is the capital of the Galgaduud region and, since 2020, the seat of the Galmudug state administration. Set on the inland plain along the main road that links Mogadishu to Galkayo and the north, the town grew up as a watering and market stop for pastoralist families moving herds across central Somalia, and livestock trading is still the rhythm of its economy.",
        "The town's political weight has grown steadily. It hosted the reconciliation conferences that reshaped Galmudug's leadership, and in February 2020 the state's electoral process was concluded here with the selection of a new administration. Government offices, the state assembly, and a growing service sector — hotels, telecoms branches, money-transfer agencies — now anchor the town.",
        "Dhusamareb is also a centre of religious scholarship in central Somalia and was long associated with the Sufi-oriented Ahlu Sunna Wal Jama'a movement, whose relationship with the state administration has shaped much of the town's recent history.",
      ],
      so: [
        "Dhuusamarreeb waa caasimadda gobolka Galgaduud, laguna yaqaan, tan iyo 2020, xarunta maamulka Dowlad Goboleedka Galmudug. Waxay ku taal bannaanka gudaha ee waddada weyn ee isku xirta Muqdisho, Gaalkacyo iyo waqooyiga dalka. Magaaladu waxay ku bilaabatay meel biyo-shub iyo suuq u ahayd reer-guuraaga xoolaha dhaqata ee bartamaha Soomaaliya, ilaa maantana ganacsiga xoolaha ayaa ah laf-dhabarta dhaqaalaheeda.",
        "Miisaanka siyaasadeed ee magaaladu si joogto ah ayuu u kordhay. Waxay martigelisay shirarkii dib-u-heshiisiineed ee qaabeeyay hoggaanka Galmudug, bishii Febraayo 2020-na waxaa halkan lagu soo gabagabeeyay doorashadii maamulka cusub ee dowlad-goboleedka. Xafiisyada dowladda, baarlamaanka gobolka iyo adeegyo sii kordhaya — hudheello, laamaha isgaarsiinta iyo wakaaladaha xawilaadda — ayaa maanta udub-dhexaad u ah magaalada.",
        "Dhuusamarreeb waxay sidoo kale xarun u tahay cilmiga diinta ee bartamaha Soomaaliya, waxaana muddo dheer lala xiriirin jiray dhaqdhaqaaqa Ahlu Sunna Wal Jamaaca ee raacsan dariiqooyinka Suufiyada, kaas oo xiriirkiisa maamulka gobolku uu qaabeeyay in badan oo taariikhda dhow ee magaalada ah.",
      ],
    },
  },
  {
    slug: "galkayo",
    name: { en: "Galkayo", so: "Gaalkacyo" },
    altName: "Gaalkacyo",
    region: { en: "Mudug", so: "Mudug" },
    population: "several hundred thousand (whole city, est.)",
    role: {
      en: "Largest urban centre of central Somalia; a city shared between two states",
      so: "Magaalada ugu weyn bartamaha Soomaaliya; magaalo ay wadaagaan laba dowlad-goboleed",
    },
    body: {
      en: [
        "Galkayo is the commercial capital of the Mudug region and one of the largest cities in Somalia. It sits at the crossroads of the country: the great north–south road from Mogadishu to Bosaso passes through it, and goods, livestock, and people from four directions meet in its markets.",
        "The city is administratively unusual: its northern sections are run by Puntland while the southern sections belong to Galmudug, an arrangement dating to the 1993 Mudug Peace Agreement. Despite periodic tension, the two halves function as one economic organism, with shared markets, intermarriage, and constant movement across the boundary line.",
        "South Galkayo — the Galmudug side — has grown rapidly, with universities, hospitals, hotels, and an airstrip of its own. The city is a major centre for the livestock trade, for transport companies, and for the telecom and money-transfer firms that knit the Somali economy together.",
      ],
      so: [
        "Gaalkacyo waa caasimadda ganacsi ee gobolka Mudug, waxayna ka mid tahay magaalooyinka ugu waaweyn Soomaaliya. Waxay ku taal isgoyska dalka: waddada weyn ee waqooyi–koonfur ee Muqdisho iyo Boosaaso isku xirta ayaa dhex marta, suuqyadeedana waxaa ku kulma badeecado, xoolo iyo dad ka yimaada afarta jiho.",
        "Magaaladu maamul ahaan waa mid gaar ah: qaybaheeda waqooyi waxaa maamula Puntland, halka qaybaha koonfureed ay ka tirsan yihiin Galmudug — qaab ka dhashay Heshiiskii Nabadeed ee Mudug ee 1993. In kasta oo mararka qaar xiinnaanku dhaco, labada qaybood waxay u shaqeeyaan sidii hal jir dhaqaale: suuqyo la wadaago, is-guursi iyo socdaal joogto ah oo dhex mara xadka labada dhinac.",
        "Gaalkacyo koonfureed — dhinaca Galmudug — si dhakhso ah ayay u kortay: jaamacado, isbitaallo, hudheello iyo garoon diyaaradeed oo u gaar ah. Magaaladu waxay xarun weyn u tahay ganacsiga xoolaha, shirkadaha gaadiidka iyo shirkadaha isgaarsiinta iyo xawilaadda ee dhaqaalaha Soomaalida isku xira.",
      ],
    },
  },
  {
    slug: "hobyo",
    name: { en: "Hobyo", so: "Hobyo" },
    altName: "Obbia",
    region: { en: "Mudug (coast)", so: "Mudug (xeebta)" },
    population: "~12,000",
    role: {
      en: "Historic port town, former capital of the Sultanate of Hobyo",
      so: "Magaalo-deked taariikhi ah, caasimaddii hore ee Saldanadda Hobyo",
    },
    body: {
      en: [
        "Hobyo is the most storied town in Galmudug. In 1878 Yusuf Ali Kenadid established the Sultanate of Hobyo here, a maritime state that traded across the Indian Ocean and treated with the imperial powers of the day, until Italy dismantled it in 1925 and folded the coast into Italian Somaliland.",
        "The old town still faces the ocean across white dunes, and fishing — lobster, tuna, shark — remains the daily livelihood. In the years around 2008–2012 the town's anchorage was notorious as a base for piracy; that chapter has closed, and attention has shifted to the sea's legitimate wealth.",
        "Hobyo's future is tied to its harbour. Its deep natural anchorage has attracted repeated port-development proposals, including a memorandum of understanding signed with Qatar in 2019 to study a modern port that would give central Somalia — and landlocked Ethiopia beyond it — a new gateway to the Indian Ocean.",
      ],
      so: [
        "Hobyo waa magaalada taariikhda ugu qanisan Galmudug. Sannadkii 1878 ayuu Yuusuf Cali Keenadiid halkan ka aasaasay Saldanadda Hobyo — dowlad badeed oo ka ganacsan jirtay Badweynta Hindiya, lana macaamili jirtay quwadihii isticmaarka ee waagaas — ilaa ay Talyaanigu burburiyeen 1925, xeebtana ku dareen Soomaaliyada Talyaaniga.",
        "Magaalada duqowday weli waxay ka soo jeeddaa badda, iyadoo ay kala dhexeeyaan bacaad cad. Kalluumeysiga — aarggosto, tuunno iyo libaax-badeed — ayaa weli ah hab-nololeedka maalinlaha ah. Sannadihii u dhexeeyay 2008–2012 marsada magaaladu waxay caan ku noqotay saldhig burcad-badeed; cutubkaas waa la soo xiray, feejignaantuna waxay u wareegtay hantida sharciga ah ee badda.",
        "Mustaqbalka Hobyo wuxuu ku xiran yahay dekeddeeda. Marsadeeda dabiiciga ah ee qoto-dheer waxay soo jiidatay hindisayaal deked oo isdaba-joog ah, oo uu ka mid yahay heshiis-qorasho lala saxiixday Qatar sannadkii 2019, si loo darso deked casri ah oo bartamaha Soomaaliya — iyo Itoobiya oo aan bad lahayn — u noqota albaab cusub oo Badweynta Hindiya ah.",
      ],
    },
  },
  {
    slug: "adado",
    name: { en: "Adado", so: "Cadaado" },
    altName: "Cadaado",
    region: { en: "Galgaduud", so: "Galgaduud" },
    population: "~50,000",
    role: {
      en: "Business-minded northern hub where the Galmudug state was formed in 2015",
      so: "Xarun ganacsi oo waqooyi ah, halkaas oo Dowlad Goboleedka Galmudug lagu aasaasay 2015",
    },
    body: {
      en: [
        "Adado, in northern Galgaduud, is one of central Somalia's success stories: a town rebuilt and expanded largely by its own business community and diaspora, with straight, planned streets, private schools and clinics, and a reputation for order that it earned during years when much of the region had little of it.",
        "Before Galmudug's expansion, Adado served as the seat of the Himan and Heeb administration, a locally organised polity formed in 2008. In 2015 the town hosted the conference that merged Himan and Heeb into the new Galmudug federal member state, and it served as the state's first interim capital before the administration moved to Dhusamareb.",
        "The town lives on livestock, cross-country trade, and remittances, and its merchants maintain trading links that stretch from Mogadishu to the Gulf.",
      ],
      so: [
        "Cadaado, oo ku taal waqooyiga Galgaduud, waa mid ka mid ah sheekooyinka guusha ee bartamaha Soomaaliya: magaalo ay inta badan dhisteen oo balaariyeen ganacsatadeeda iyo qurbajoogteeda — waddooyin toosan oo qorsheysan, iskuullo iyo rugo caafimaad oo gaar loo leeyahay, iyo sumcad nidaam oo ay kasbatay sannado ay inta badan gobolku nidaam yari jirtay.",
        "Ka hor balaarinta Galmudug, Cadaado waxay xarun u ahayd maamulkii Ximan iyo Xeeb, oo ahaa maamul deegaan oo la aasaasay 2008. Sannadkii 2015 magaaladu waxay martigelisay shirkii lagu daray Ximan iyo Xeeb dowlad-goboleedka cusub ee Galmudug, waxayna noqotay caasimaddii ugu horreysay ee ku-meel-gaarka ah ka hor inta aanu maamulku u guurin Dhuusamarreeb.",
        "Magaaladu waxay ku nooshahay xoolo-dhaqato, ganacsi dhex mara gobollada iyo xawilaadaha qurbajoogta; ganacsatadeeduna waxay xiriir ganacsi la leeyihiin Muqdisho ilaa dalalka Khaliijka.",
      ],
    },
  },
  {
    slug: "abudwak",
    name: { en: "Abudwak", so: "Caabudwaaq" },
    altName: "Caabudwaaq",
    region: { en: "Galgaduud (west)", so: "Galgaduud (galbeed)" },
    population: "~40,000",
    role: {
      en: "Western border-trade town with one of the region's largest diasporas",
      so: "Magaalo ganacsi oo xadka galbeed ku taal, leh qurbajoog ka mid ah kuwa ugu badan gobolka",
    },
    body: {
      en: [
        "Abudwak lies in western Galgaduud near the Ethiopian border, on the caravan lines that have always tied central Somalia to the Somali-inhabited regions of eastern Ethiopia. Cross-border trade — livestock going one way, goods and khat coming the other — is the town's economic engine.",
        "The district is known for the size and organisation of its diaspora, whose remittances and community funds have built schools, water systems, and health facilities at a pace few towns in the region can match. Telephone and money-transfer offices line the main street, the visible plumbing of that long-distance economy.",
        "Like all of Galgaduud, Abudwak's surrounding countryside lives by the camel and the rains; in drought years the town swells with pastoralist families seeking water, work, and help.",
      ],
      so: [
        "Caabudwaaq waxay ku taal galbeedka Galgaduud, meel u dhow xadka Itoobiya, kuna taal waddooyinkii safarrada ee weligood isku xiri jiray bartamaha Soomaaliya iyo deegaannada Soomaalidu degto ee bariga Itoobiya. Ganacsiga xad-gudubka ah — xoolo dhinac u socda, badeecado iyo qaad dhinaca kale ka imanaya — waa matoorka dhaqaalaha magaalada.",
        "Degmadu waxay caan ku tahay tirada iyo abaabulka qurbajoogteeda, kuwaas oo xawilaadahooda iyo sanduuqyadooda bulsheed ay ku dhiseen iskuullo, nidaamyo biyood iyo xarumo caafimaad — xawli ay magaalooyin yar oo gobolka ka mid ahi la mid noqon karaan. Xafiisyada taleefanka iyo xawilaadda ayaa ku teedsan waddada weyn — muuqaalka cad ee dhaqaalahaas fogaanta ah.",
        "Sida Galgaduud oo dhan, baadiyaha ku xeeran Caabudwaaq wuxuu ku nool yahay geela iyo roobabka; sannadaha abaartu magaaladu waxay la buuxsantaa qoysas reer-guuraa ah oo doonaya biyo, shaqo iyo gargaar.",
      ],
    },
  },
  {
    slug: "el-buur",
    name: { en: "El Buur", so: "Ceelbuur" },
    altName: "Ceelbuur",
    region: { en: "Galgaduud (central)", so: "Galgaduud (bartamaha)" },
    population: "~20,000",
    role: {
      en: "Ancient well town at the geographic heart of Galgaduud",
      so: "Magaalo ceelal qadiimi ah oo ku taal wadnaha juqraafi ee Galgaduud",
    },
    body: {
      en: [
        "El Buur — 'the well of the hill' — takes its name from the deep wells cut into the limestone that have watered herds here for centuries. The town sits near the geographic centre of Galgaduud and was historically a meeting point for pastoral clans, famous for its wells, its caves, and its poets.",
        "The district paid a heavy price in Somalia's conflict years: it changed hands repeatedly and spent long periods under insurgent control, cut off from trade and services. Government-led operations in the 2022–2023 central Somalia offensive returned much of the district to state administration, and rebuilding its roads, wells, and market links is now the priority.",
        "El Buur is also known across Somalia as the traditional home of expert well-diggers and stoneworkers, a craft heritage the district's elders are keen to see revived.",
      ],
      so: [
        "Ceelbuur — magaceedu wuxuu ka yimid ceelasha qoto-dheer ee dhagaxa nuurada laga qoday, kuwaas oo qarniyo xoolaha halkan ka waraabinayay. Magaaladu waxay u dhow dahay bartamaha juqraafi ee Galgaduud, taariikh ahaanna waxay ahayd goob ay ku kulmaan beelaha reer-guuraaga ah — waxaa loogu yiqiin ceelasheeda, godadkeeda iyo gabayaageeda.",
        "Degmadu qiimo culus ayay ku bixisay sannadihii colaadda Soomaaliya: gacmo badan ayay martay, muddo dheerna waxay ku jirtay gacanta maleeshiyaad, iyadoo ka go'day ganacsi iyo adeegyo. Hawlgalladii dowladda ee duulaankii bartamaha Soomaaliya 2022–2023 ayaa qayb weyn oo degmada ah ku soo celiyay maamulka dowladda; dib-u-dhiska waddooyinkeeda, ceelasheeda iyo xiriirkeeda suuqyada ayaa hadda ah mudnaanta koowaad.",
        "Ceelbuur waxaa sidoo kale Soomaaliya oo dhan looga yaqaan hoyga dhaqameed ee ceel-qodayaasha iyo farsamayaqaannada dhagaxa — hidde farsamo oo odayaasha degmadu jecel yihiin in dib loo soo nooleeyo.",
      ],
    },
  },
  {
    slug: "harardhere",
    name: { en: "Harardhere", so: "Xarardheere" },
    altName: "Xarardheere",
    region: { en: "Mudug (coast)", so: "Mudug (xeebta)" },
    population: "~15,000",
    role: {
      en: "Coastal district returned to state control in 2023, with real fishing potential",
      so: "Degmo xeebeed 2023 dib ugu soo noqotay gacanta dowladda, leh suurtagalnimo kalluumeysi oo dhab ah",
    },
    body: {
      en: [
        "Harardhere stretches along the Indian Ocean south of Hobyo, where the dunes meet some of the richest and least-fished waters in the western Indian Ocean. For generations its people have combined herding inland with small-boat fishing on the coast.",
        "The town's name travelled the world for the wrong reasons twice: in the late 2000s as a piracy anchorage, and afterwards under long insurgent control. In January 2023, Somali National Army forces and allied local fighters retook Harardhere during the central Somalia offensive, returning the district to state administration for the first time in over a decade.",
        "With peace, the district's conversation has turned to boats, ice plants, and feeder roads — the modest infrastructure that would let its fishermen reach markets in Galkayo and beyond.",
      ],
      so: [
        "Xarardheere waxay ku fidsan tahay xeebta Badweynta Hindiya ee koonfurta Hobyo, halkaas oo bacaadku kula kulmo biyaha ugu hodansan uguna kalluumeysi-yaraan galbeedka Badweynta Hindiya. Tacabkii facyada dadkeedu waxay isku dareen xoolo-dhaqashada gudaha iyo kalluumeysi doonyo-yaraad ah oo xeebta ah.",
        "Magaca magaaladu adduunka wuxuu ugu safray sababo xun laba jeer: dabayaaqadii 2000-meeyadii marsada burcad-badeedda ahaan, kadibna muddo dheer oo maleeshiyaad gacanta ku hayeen. Bishii Janaayo 2023, ciidamada Xoogga Dalka Soomaaliyeed iyo dagaalyahanno deegaan oo la safan ayaa Xarardheere dib ula wareegay xilligii duulaanka bartamaha Soomaaliya, iyagoo degmada ku soo celiyay maamulka dowladda markii ugu horreysay muddo toban sano ka badan.",
        "Nabadda la timid, hadal-haynta degmadu waxay u wareegtay doonyo, warshado baraf iyo waddooyin gaadhsiin — kaabayaasha hoose ee u oggolaan lahaa kalluumeysatadeedu inay gaaraan suuqyada Gaalkacyo iyo wixii ka shisheeya.",
      ],
    },
  },
  {
    slug: "guriel",
    name: { en: "Guriel", so: "Guriceel" },
    altName: "Guriceel",
    region: { en: "Galgaduud", so: "Galgaduud" },
    population: "~60,000",
    role: {
      en: "Commercial crossroads on the Mogadishu–Dhusamareb road",
      so: "Isgoys ganacsi oo ku yaal waddada Muqdisho–Dhuusamarreeb",
    },
    body: {
      en: [
        "Guriel is one of Galgaduud's largest towns and its busiest ordinary market: a place of truck stops, livestock yards, wholesalers, and workshops on the main road that carries central Somalia's trade toward Mogadishu.",
        "The town has repeatedly been a prize in the region's politics — most recently in late 2021, when heavy fighting between Galmudug state forces and the Ahlu Sunna Wal Jama'a movement displaced much of the population before the town settled back under state administration. Its recovery since has been driven, as ever, by its merchants.",
        "Guriel is also a service centre for a wide pastoral hinterland, with hospitals and schools — several diaspora-funded — that draw patients and students from across central Galgaduud.",
      ],
      so: [
        "Guriceel waa mid ka mid ah magaalooyinka ugu waaweyn Galgaduud, waana suuqeeda maalinlaha ah ee ugu mashquulka badan: goob ay ku kulmaan boosteejooyin gawaari, xeryo xoolaad, ganacsato jumlo iyo aqoonyahanno farsamo — waxayna ku taal waddada weyn ee ganacsiga bartamaha Soomaaliya u qaadda dhanka Muqdisho.",
        "Magaaladu waxay marar badan noqotay abaal-marin siyaasadeed oo gobolka ah — ugu dambayntii dabayaaqadii 2021, markii dagaal culus oo dhex maray ciidamada Galmudug iyo dhaqdhaqaaqa Ahlu Sunna Wal Jamaaca uu barakiciyay dad badan oo reer magaal ah, ka hor inta aanay magaaladu ku sii xasilin maamulka dowlad-goboleedka. Soo-kabashadeeda tan iyo markaas waxaa waday, sidii caadada ahayd, ganacsatadeeda.",
        "Guriceel waxay sidoo kale adeegyo u fidisaa baadiye ballaaran oo reer-guuraa ah: isbitaallo iyo iskuullo — qaar ay qurbajoogtu maalgeliyeen — ayaa soo jiita bukaanno iyo arday ka yimaada bartamaha Galgaduud oo dhan.",
      ],
    },
  },
];

export function getDistrict(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}
