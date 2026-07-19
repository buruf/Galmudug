import type { Bilingual, BilingualParagraphs } from "./districts";

export interface RegionSection {
  heading: Bilingual;
  body: BilingualParagraphs;
}

export interface RegionPage {
  slug: string;
  title: Bilingual;
  metaDescription: Bilingual;
  intro: Bilingual;
  sections: RegionSection[];
}

export const REGION_PAGES: RegionPage[] = [
  {
    slug: "geography",
    title: { en: "Geography of Galmudug", so: "Juqraafiga Galmudug" },
    metaDescription: {
      en: "The land and climate of Galmudug: the Indian Ocean coast, the Mudug and Galgaduud plains, seasonal rains, and the pastoral landscape of central Somalia.",
      so: "Dhulka iyo cimilada Galmudug: xeebta Badweynta Hindiya, bannaanka Mudug iyo Galgaduud, roobabka xilliyeedka iyo muuqaalka reer-guuraaga ee bartamaha Soomaaliya.",
    },
    intro: {
      en: "Galmudug occupies the waist of Somalia — the band of territory where the country narrows between the Ethiopian border and the Indian Ocean. It comprises the Galgaduud region and the southern half of Mudug, an area of savanna plains, red sand, limestone wells, and a long, almost untouched coastline.",
      so: "Galmudug waxay ku taal dhexda Soomaaliya — xarriiqda dhulka ee dalku isku soo dhawaado inta u dhexeysa xadka Itoobiya iyo Badweynta Hindiya. Waxay ka kooban tahay gobolka Galgaduud iyo qaybta koonfureed ee Mudug: dhul bannaan oo doog ah, carro guduudan, ceelal dhagax nuurad ah iyo xeeb dheer oo aan weli la taaban.",
    },
    sections: [
      {
        heading: { en: "The lie of the land", so: "Qaabka dhulka" },
        body: {
          en: [
            "From east to west the state rises gently in three broad steps. Along the ocean runs a coastal strip of white dunes and salt flats, in places several kilometres deep, behind the old ports of Hobyo and Harardhere. Inland begins the Mudug–Galgaduud plain, an enormous expanse of red sandy savanna scattered with acacia and thornbush, which carries the great camel herds that define the region. Toward the Ethiopian border the land lifts onto the eastern edge of the Haud plateau, higher, slightly cooler grazing country that Somali pastoralists have crossed with the seasons for centuries.",
            "There are no permanent rivers anywhere in Galmudug. Life depends on deep wells cut into the limestone — many of them ancient — together with hand-dug water pans (balli) and cemented rain cisterns (berkado) that store the two rainy seasons against the long dry months.",
          ],
          so: [
            "Bari ilaa galbeed dhulku si tartiib ah ayuu ugu kacaa saddex tallaabo oo ballaaran. Badda dhinaceeda waxaa ku fidsan marin xeebeed oo bacaad cad iyo dhul cusbo leh, meelaha qaarkood dhowr kiiloomitir u qoto-dheer, gadaashiisana yaal dekedihii hore ee Hobyo iyo Xarardheere. Gudaha waxaa ka bilaabma bannaanka Mudug–Galgaduud: baaxad aad u weyn oo doog carro-guduudan ah, oo ay ku kala firidhsan yihiin geedo qudhac iyo qodax, kuna nool yihiin geela tirada badan ee gobolka astaanta u ah. Dhanka xadka Itoobiya dhulku wuxuu u kacaa cidhifka bari ee taagga Hawd — dhul daaq oo ka sarreeya kana qabow yar, oo reer-guuraaga Soomaalidu qarniyo ku gooshayeen xilliyada.",
            "Webi joogto ah kama jiro Galmudug meelna. Noloshu waxay ku tiirsan tahay ceelal qoto-dheer oo dhagaxa nuurada laga qoday — qaar badan oo qadiimi ah — iyo balliyo gacanta lagu qoday iyo berkado shubka ah oo kaydiya labada xilli-roobaad ee ka hortagga bilaha dheer ee abaarta.",
          ],
        },
      },
      {
        heading: { en: "Climate and seasons", so: "Cimilada iyo xilliyada" },
        body: {
          en: [
            "The climate is hot and semi-arid to arid, with annual rainfall mostly between 100 and 300 millimetres. The Somali year turns on four seasons: the main Gu rains from roughly April to June, the hot dry Xagaa of July to September on the coast, the shorter Deyr rains of October and November, and the long dry Jilaal from December to March, the hardest season for herds and households alike. Coastal towns are tempered by the sea breeze; inland, daytime temperatures routinely pass 35°C.",
            "Rainfall is famously unreliable. Consecutive failed seasons bring drought — the 2016–17 and 2021–23 droughts hit central Somalia severely — and a good Gu can transform the plains within weeks into green pasture that draws herders from hundreds of kilometres away.",
          ],
          so: [
            "Cimiladu waa kulul, dhul-engegan ilaa abaareed, roobka sannadkiiba inta badan wuxuu u dhexeeyaa 100 ilaa 300 milimitir. Sannadka Soomaalidu wuxuu u wareegaa afar xilli: roobabka waaweyn ee Gu' (Abriil ilaa Juun), Xagaaga kulul ee engegan (Luulyo ilaa Sebtembar) ee xeebaha, roobabka gaagaaban ee Dayr (Oktoobar iyo Nofembar), iyo Jiilaalka dheer ee engegan (Diseembar ilaa Maarso) — xilliga ugu adag xoolaha iyo qoysaska. Magaalooyinka xeebta waxaa qabowjiya neecawda badda; gudaha, kulaylka maalintii wuxuu si caadi ah uga gudbaa 35°C.",
            "Roobku waa mid aan la isku halleyn karin. Xilliyo isdaba-joog ah oo gabaa waxay keenaan abaar — abaartii 2016–17 iyo tii 2021–23 si daran ayay u saameeyeen bartamaha Soomaaliya — Gu' wanaagsanina toddobaadyo gudahood ayuu bannaanka u beddelaa daaq cagaaran oo soo jiita xoolo-dhaqato boqollaal kiiloomitir ka soo socota.",
          ],
        },
      },
      {
        heading: { en: "Coast, flora and fauna", so: "Xeebta, dhirta iyo duurjoogta" },
        body: {
          en: [
            "Galmudug's roughly 700-kilometre coastline faces some of the most productive and least exploited waters of the western Indian Ocean, rich in tuna, lobster, and demersal fish. The shore itself alternates between dune fields, rocky headlands, and long empty beaches; Hobyo's dunes, slowly advancing on the old town, are among the most striking landscapes in Somalia.",
            "The savanna carries a hardy dryland ecology: acacia and commiphora woodland, seasonal grasses, and wildlife including dik-dik, gerenuk, warthog, ostrich, and bustard. Decades of conflict and charcoal cutting have pressed hard on trees and game alike, and local administrations have begun — modestly — to restrict charcoal export and protect what remains.",
          ],
          so: [
            "Xeebta Galmudug ee qiyaastii 700 kiiloomitir ah waxay ka soo jeeddaa biyaha ugu wax-soosaarka badan uguna faa'iidaysi-yaraan galbeedka Badweynta Hindiya — hodan ku ah tuunno, aarggosto iyo kalluun-guntada. Xeebta lafteedu waxay isugu beddeshaa bacaad, madaxyo dhagax ah iyo xeebo dhaadheer oo madhan; bacaadka Hobyo, ee si tartiib ah ugu soo dhowaanaya magaalada duqowday, wuxuu ka mid yahay muuqaallada ugu qurxoon Soomaaliya.",
            "Bannaanku wuxuu sitaa deegaan dhul-engegan oo adkaysi leh: kayn qudhac iyo dhir malmal ah, doog xilliyeed, iyo duurjoog ay ka mid yihiin sagaaro, garanuug, dofaar-duur, gorayo iyo xuur. Tobanaan sano oo colaad iyo dhuxul-gubis ah ayaa si adag u saameeyay dhirta iyo ugaadha; maamullada deegaanku waxay bilaabeen — si xaddidan — inay xakameeyaan dhoofinta dhuxusha oo ay ilaaliyaan inta hadhay.",
          ],
        },
      },
    ],
  },
  {
    slug: "history",
    title: { en: "History of Galmudug", so: "Taariikhda Galmudug" },
    metaDescription: {
      en: "From the Sultanate of Hobyo through Italian rule, independence, and civil war to the formation of the Galmudug federal member state in 2015.",
      so: "Laga soo bilaabo Saldanaddii Hobyo, gumeysigii Talyaaniga, xornimadii iyo dagaalkii sokeeye, ilaa aasaaskii dowlad-goboleedka Galmudug ee 2015.",
    },
    intro: {
      en: "The name Galmudug is new — a fusion of Galgaduud and Mudug coined in the 2000s — but the land it names has a deep past: pastoral clans and their poets, an Indian Ocean sultanate, colonial partition, and a hard-won return to organised government.",
      so: "Magaca Galmudug waa mid cusub — isku-dar Galgaduud iyo Mudug ah oo la curiyay 2000-meeyadii — laakiin dhulka uu magacaabayaa wuxuu leeyahay taariikh qoto-dheer: beelo reer-guuraa ah iyo gabayaagooda, saldanad Badweynta Hindiya ah, qaybsigii gumeysiga iyo soo-noqosho dhib lagu helay oo dowladnimo habaysan ah.",
    },
    sections: [
      {
        heading: { en: "The Sultanate of Hobyo", so: "Saldanaddii Hobyo" },
        body: {
          en: [
            "For centuries the interior belonged to pastoral society — herds, wells, seasonal migration, and the oral law (xeer) and poetry that governed and recorded it — while the coast traded with Arabia, Persia, and India. In 1878 Yusuf Ali Kenadid, breaking away from the Majeerteen Sultanate to the north, founded the Sultanate of Hobyo, which came to control much of the Mudug coast and its hinterland. The sultanate kept a small fleet and an army, minted its influence through trade, and dealt directly with the imperial powers scrambling for the region.",
            "Italy declared a protectorate over Hobyo in 1888. The arrangement — nominal Italian suzerainty over a functioning Somali state — lasted until 1925, when Italy deposed the sultanate outright and absorbed the territory into Italian Somaliland. Resistance, notably by Omar Samatar, who twice took the fort at El Buur in 1925–26, is still remembered in song and verse.",
          ],
          so: [
            "Qarniyo badan gudaha dhulku wuxuu lahaa bulsho reer-guuraa ah — xoolo, ceelal, guuritaan xilliyeed, iyo xeerka afka ah iyo gabayada wax lagu xukumi jiray laguna duubi jiray — halka xeebtu ay ka ganacsan jirtay Carabta, Faaris iyo Hindiya. Sannadkii 1878 Yuusuf Cali Keenadiid, oo ka soo goostay Saldanaddii Majeerteen ee waqooyiga, wuxuu aasaasay Saldanadda Hobyo, taas oo yeelatay inta badan xeebta Mudug iyo dhulka ka dambeeya. Saldanaddu waxay lahayd doonyo iyo ciidan yar, saamayntedana waxay ku fidisay ganacsi, waxayna si toos ah ula macaamishay quwadihii isticmaarka ee gobolka ku loolamayay.",
            "Talyaanigu wuxuu Hobyo ku dhawaaqay maxmiyad sannadkii 1888. Qaabkaas — madax-bannaani magac ah oo Talyaani oo saaran dowlad Soomaaliyeed oo shaqaynaysa — wuxuu socday ilaa 1925, markii Talyaanigu si buuxda u afgembiyay saldanadda, dhulkana ku daray Soomaaliyada Talyaaniga. Iska-caabbinta — gaar ahaan tii Cumar Samatar, oo laba jeer qabsaday qalcaddii Ceelbuur 1925–26 — weli waxaa lagu xusuustaa hees iyo gabay.",
          ],
        },
      },
      {
        heading: {
          en: "Colonial rule, independence, and the republic",
          so: "Gumeysigii, xornimadii iyo jamhuuriyaddii",
        },
        body: {
          en: [
            "Under Italian rule the central regions remained a pastoral periphery, administered lightly from the coast. After the Second World War and a decade of UN trusteeship, Italian Somaliland united with British Somaliland at independence on 1 July 1960 to form the Somali Republic. Galkayo and the central towns grew as administrative and trading centres in the new state, and later under the military government of Siad Barre, which invested in wells, townships, and the cooperative herding schemes of the 1970s.",
            "The same decades planted the seeds of crisis: drought (notably the daba-dheer drought of 1974–75), the 1977–78 Ogaden war with Ethiopia, and a deepening authoritarianism that turned clan against clan. By the late 1980s the state was dissolving.",
          ],
          so: [
            "Xukunkii Talyaaniga gobollada dhexe waxay ku sii jireen duleedka reer-guuraaga, iyadoo si fudud xeebta looga maamuli jiray. Dagaalkii Labaad ee Adduunka kadib, iyo toban sano oo wisaayad Qaramada Midoobay ah, Soomaaliyada Talyaanigu waxay xornimada ku midowday Soomaaliyada Ingiriiska 1-dii Luulyo 1960, waxayna dhashay Jamhuuriyaddii Soomaaliya. Gaalkacyo iyo magaalooyinka dhexe waxay ku koreen xarumo maamul iyo ganacsi dowladdii cusub, kadibna xukunkii milatariga ee Siyaad Barre, oo maalgeliyay ceelal, tuulooyin iyo mashaariicdii wershadaha xoolaha ee 1970-meeyadii.",
            "Isla tobannaankaas sano waxay beereen abuurkii qalalaasaha: abaartii daba-dheer ee 1974–75, dagaalkii Soomaaliya iyo Itoobiya ee 1977–78, iyo kali-talisnimo sii qoto-dheeraanaysa oo beel beel kale ku kicisay. Dabayaaqadii 1980-meeyadii dowladdii way sii milmaysay.",
          ],
        },
      },
      {
        heading: {
          en: "Civil war and the road to Galmudug",
          so: "Dagaalkii sokeeye iyo waddadii Galmudug",
        },
        body: {
          en: [
            "After the state collapsed in 1991, central Somalia became a contested frontier between armed factions, and Galkayo a divided city — an outcome stabilised, imperfectly but durably, by the Mudug Peace Agreement of 1993, which still underlies the city's north–south arrangement. In the vacuum, communities improvised: local administrations such as Himan and Heeb (2008, based in Adado) kept a measure of order, while the Sufi movement Ahlu Sunna Wal Jama'a took up arms after 2008 to defend the central regions against Al-Shabaab, holding Dhusamareb and much of Galgaduud.",
            "A first 'Galmudug' administration was declared in south Galkayo in 2006. The decisive step came in 2015, when a conference in Adado merged the existing administrations into the Galmudug Interim Administration, a federal member state under Somalia's provisional constitution. After years of friction between the state and Ahlu Sunna, a 2020 electoral process in Dhusamareb produced a single administration under President Ahmed Abdi Karie 'Qoorqoor', and the state capital settled in Dhusamareb.",
            "Since 2022 Galmudug has been the main theatre of the government's offensive — fought alongside local 'Ma'awisley' community forces — that pushed Al-Shabaab out of long-held districts including Harardhere and much of El Buur and El Dher. Consolidating those gains, and rebuilding what conflict unbuilt, is the state's present chapter.",
          ],
          so: [
            "Burburkii dowladda ee 1991 kadib, bartamaha Soomaaliya wuxuu noqday xuduud lagu loolamo oo u dhexeysa kooxo hubaysan, Gaalkacyona magaalo qaybsan — natiijo uu xasiliyay, si aan qummanayn balse waaraysa, Heshiiskii Nabadeed ee Mudug ee 1993, kaas oo weli saldhig u ah qaabka waqooyi–koonfur ee magaalada. Faaruqnimadaas, bulshooyinku way is-abaabuleen: maamullo deegaan sida Ximan iyo Xeeb (2008, oo Cadaado fadhigeedu ahaa) ayaa nidaam ilaaliyay, halka dhaqdhaqaaqa Suufiyada ee Ahlu Sunna Wal Jamaaca uu hub qaatay 2008 kadib si uu gobollada dhexe uga difaaco Al-Shabaab, isagoo qabsaday Dhuusamarreeb iyo inta badan Galgaduud.",
            "Maamulkii ugu horreeyay ee 'Galmudug' waxaa lagu dhawaaqay Gaalkacyo koonfureed 2006. Tallaabadii go'aanka lahayd waxay timid 2015, markii shir Cadaado ka dhacay uu maamulladii jiray ku daray Maamulka Ku-meel-gaarka ah ee Galmudug — dowlad-goboleed federaal ah oo hoos timaada dastuurka ku-meel-gaarka ah ee Soomaaliya. Sannado xiisad ah oo u dhexeysay dowlad-goboleedka iyo Ahlu Sunna kadib, doorashadii 2020 ee Dhuusamarreeb waxay dhashay maamul keliya oo uu hoggaamiyo Madaxweyne Axmed Cabdi Kaariye 'Qoorqoor', caasimaddiina waxay ku sugnaatay Dhuusamarreeb.",
            "Tan iyo 2022 Galmudug waxay ahayd goobta ugu weyn ee duulaanka dowladda — oo lala galay ciidamada bulshada ee 'Macawisley' — kaas oo Al-Shabaab ka saaray degmooyin ay muddo dheer hayeen, oo ay ku jiraan Xarardheere iyo inta badan Ceelbuur iyo Ceeldheer. Sii-adkaynta guulahaas, iyo dib-u-dhiska wixii colaaddu dumisay, ayaa ah cutubka hadda ee dowlad-goboleedka.",
          ],
        },
      },
    ],
  },
  {
    slug: "culture",
    title: { en: "Culture of Galmudug", so: "Dhaqanka Galmudug" },
    metaDescription: {
      en: "Poetry, pastoral tradition, faith, food, and everyday culture in Galmudug and central Somalia.",
      so: "Gabayada, hiddaha reer-guuraaga, diinta, cuntada iyo dhaqanka maalinlaha ah ee Galmudug iyo bartamaha Soomaaliya.",
    },
    intro: {
      en: "Central Somalia's culture is the culture of the camel country: a civilisation of verse, livestock, faith, and fierce hospitality, carried for centuries in memory rather than writing — and now equally at home in WhatsApp voice notes between Guriel and Minneapolis.",
      so: "Dhaqanka bartamaha Soomaaliya waa dhaqanka dhulka geela: ilbaxnimo gabay, xoolo, diin iyo marti-soor deeqsinimo leh, oo qarniyo lagu xambaaray xusuusta oo aan qorniin ahayn — maantana si isku mid ah ugu guriyaysan farriimaha codka ah ee WhatsApp ee dhex mara Guriceel iyo Minneapolis.",
    },
    sections: [
      {
        heading: { en: "The word: poetry and language", so: "Erayga: gabayga iyo afka" },
        body: {
          en: [
            "Somalis call their nation a 'nation of poets', and the central regions have supplied more than their share. Classical gabay — long, alliterative, argued like a court case — was the region's newspaper, parliament, and archive at once; a single poem could raise a militia or settle a feud. The tradition is living: poems about drought, politics, and diaspora life circulate today by phone and social media at a speed the old reciters would envy.",
            "The language of daily life is Somali (af-Soomaali), written in the Latin script adopted in 1972. The central dialects are close to the standard taught in schools and used by broadcasters, which is one reason central Somali voices are prominent in the country's media. Arabic is the language of religion; English is increasingly the third language of the young.",
          ],
          so: [
            "Soomaalidu waxay ummaddooda ku tilmaantaa 'ummad gabyaa ah', gobollada dhexena waxay bixiyeen qayb ka badan saamigooda. Gabayga fanka ah — dheer, higgaad-raac, sida dacwad maxkamadeed loo doodo — wuxuu isku mar u ahaa gobolka wargeys, baarlamaan iyo kayd; hal gabay wuxuu kicin karay col ama dami karay colaad. Hidduhu waa mid nool: gabayo ku saabsan abaar, siyaasad iyo nolosha qurbaha ayaa maanta taleefan iyo baraha bulshada ku wareegaya xawli ay ku hinaasi lahaayeen abwaannadii hore.",
            "Afka nolosha maalinlaha ahi waa af-Soomaali, oo lagu qoro farta Laatiinka ee la qaatay 1972. Lahjadaha dhexe waxay u dhow yihiin afka rasmiga ah ee iskuullada lagu dhigo ee warbaahintu isticmaasho — taas oo ka mid ah sababaha codadka bartamaha Soomaaliya ugu muuqdaan warbaahinta dalka. Af-Carabigu waa afka diinta; af-Ingiriisiguna wuxuu si isa soo taraysa u noqonayaa afka saddexaad ee dhallinyarada.",
          ],
        },
      },
      {
        heading: { en: "The herd: pastoral life", so: "Xoolaha: nolosha reer-guuraaga" },
        body: {
          en: [
            "The camel is the region's measure of wealth, poetry's favourite subject, and an engineering marvel for this climate: it converts thornbush into milk through the driest Jilaal. Households historically split between a mobile camel camp of young men ranging far for pasture and a settlement of the rest of the family with sheep and goats near the wells. That pattern persists, loosened by towns, trucks, and mobile money — a herder in the Haud today sells an animal by phone and receives payment on it too.",
            "From pastoral life come the region's deepest institutions: xeer, the negotiated customary law between lineages; the obligation of hospitality to the traveller; and the seasonal cycle of movement, negotiation over wells, and reunion that structures the year.",
          ],
          so: [
            "Geelu waa halbeegga hantida gobolka, mawduuca ugu jecel gabayga, iyo mucjiso hindise oo cimiladan ku habboon: qodax wuxuu u beddelaa caano xilliga Jiilaalka ugu engegan. Qoysasku taariikh ahaan waxay u kala qaybsami jireen geel-jire dhallinyaro ah oo daaq fog u guura, iyo degitaan ay ku sugan yihiin inta kale ee qoyska iyo adhiga oo ceelasha u dhow. Qaabkaas weli wuu jiraa, hase yeeshee waxaa dabciyay magaalooyin, gawaari iyo lacag-mobil ah — xoolo-dhaqde Hawd jooga ayaa maanta neef taleefan ku iibiya, lacagtana isla taleefanka ku helaya.",
            "Nolosha reer-guuraaga waxaa ka soo jeeda hay'adaha ugu qoto-dheer gobolka: xeerka, sharciga dhaqameed ee beelaha dhexdooda lagu gorgortamo; waajibka marti-soorka ee socotada; iyo wareegga xilliyeedka ee guuritaanka, gorgortanka ceelasha iyo isu-imaatinka ee sannadka qaabeeya.",
          ],
        },
      },
      {
        heading: { en: "Faith, food, and celebration", so: "Diinta, cuntada iyo dabbaaldegga" },
        body: {
          en: [
            "Islam orders daily life across Galmudug, and the central regions have a strong Sufi heritage — the Qadiriyya and other orders built centres of learning here, a legacy that the Ahlu Sunna movement drew on in recent decades. Religious festivals, Ramadan nights, and the naming, wedding, and mourning customs of the region blend Islamic practice with older Somali form.",
            "The table tells the region's story: camel milk drunk fresh or soured; muqmad (dried meat preserved in ghee, the traveller's food); canjeero flatbread at breakfast; rice and pasta — Italy's most durable legacy — at lunch; goat meat for guests. Celebration means poetry and dance, above all the dhaanto, the region's driving, stamping dance-song, revived everywhere from school competitions to diaspora weddings.",
          ],
          so: [
            "Islaamku wuxuu habeeyaa nolosha maalinlaha ah ee Galmudug oo dhan, gobollada dhexena waxay leeyihiin hidde Suufi oo xoog leh — Qaadiriyada iyo dariiqooyin kale waxay halkan ka dhiseen xarumo cilmi, dhaxal uu dhaqdhaqaaqa Ahlu Sunna ku tiirsanaa tobannaankii sano ee u dambeeyay. Ciidaha diinta, habeennada Ramadaan, iyo caadooyinka magac-bixinta, arooska iyo tacsida ee gobolku waxay isku daraan dhaqanka Islaamka iyo qaab-Soomaaliyeedkii hore.",
            "Miiska cuntadu wuxuu sheegaa taariikhda gobolka: caano geel oo la lisay ama gadhoodh ah; muqmad (hilib la qalajiyay oo subag lagu kaydiyay — sahayda socotada); canjeero quraacda; bariis iyo baasto — dhaxalka ugu waara ee Talyaaniga — qadada; hilib ari martida. Dabbaaldeggu waa gabay iyo ciyaar, dusheedana dhaanto — heesta-ciyaareed ee garaaca leh ee gobolka, oo dib ugu soo noolaatay meel kasta, tartammada iskuullada ilaa aroosyada qurbaha.",
          ],
        },
      },
    ],
  },
  {
    slug: "economy",
    title: { en: "Economy of Galmudug", so: "Dhaqaalaha Galmudug" },
    metaDescription: {
      en: "Livestock, fishing, trade, telecoms, and remittances: how Galmudug's economy works and where it is heading.",
      so: "Xoolaha, kalluumeysiga, ganacsiga, isgaarsiinta iyo xawilaadaha: sida dhaqaalaha Galmudug u shaqeeyo iyo halka uu u socdo.",
    },
    intro: {
      en: "Galmudug's economy stands on four legs: the herd, the sea, the road, and the diaspora. None of them passes through a bank as the textbooks imagine — yet together they move serious money, almost all of it over mobile phones.",
      so: "Dhaqaalaha Galmudug wuxuu ku taagan yahay afar lugood: xoolaha, badda, waddada iyo qurbajoogta. Midkoodna kuma dhex maro bangi sida buugaagtu qiyaasaan — hase yeeshee si wadajir ah waxay dhaqaajiyaan lacag aad u weyn, oo ku dhowaad dhammaan taleefannada gacanta lagu kala qaado.",
    },
    sections: [
      {
        heading: { en: "Livestock: the foundation", so: "Xoolaha: aasaaska" },
        body: {
          en: [
            "Livestock is the region's export industry, savings account, and social security in one. Camels, sheep, and goats raised on the Galgaduud and Mudug plains walk or truck to the markets of Galkayo and onward — north to Bosaso for export to the Gulf, or south to Mogadishu. Peak season is the Hajj, when Gulf demand for Somali animals surges. Drought is the industry's recurring catastrophe: each failed rains cycle strips household herds, and each recovery takes years.",
            "Around the animal trade has grown a service economy of brokers (dilaal), truckers, fodder sellers, veterinary drug shops, and market-day retail that makes towns like Guriel and Dhusamareb hum.",
          ],
          so: [
            "Xooluhu waa warshadda dhoofinta, bangiga keydka iyo caymiska bulsheed ee gobolka oo hal shay ku jira. Geela, ido iyo riyaha lagu koriyo bannaanka Galgaduud iyo Mudug waxay u socdaan — lug ama gawaari — suuqyada Gaalkacyo, halkaasna waqooyi u sii maraan Boosaaso si Khaliijka loogu dhoofiyo, ama koonfur ugu jeestaan Muqdisho. Xilliga ugu sarreeya waa Xajka, marka baahida Khaliijku ee xoolaha Soomaalidu kacdo. Abaartu waa masiibada soo noqnoqota ee warshaddan: wareeg kasta oo roob-gabay ah wuxuu qaadaa xoolaha qoysaska, soo-kabasho kastana waxay qaadataa sannado.",
            "Ganacsiga xoolaha hareerihiisa waxaa ka baxay dhaqaale adeeg: dilaaliin, gawaari-wadayaal, cunto-xoolaad iibiyayaal, dukaammo daawooyin xoolaad iyo tafaariiq maalin-suuqeed — kuwaas oo magaalooyinka sida Guriceel iyo Dhuusamarreeb ka dhiga meelo firfircoon.",
          ],
        },
      },
      {
        heading: { en: "The sea and the road", so: "Badda iyo waddada" },
        body: {
          en: [
            "The coast is the economy's sleeping giant. Galmudug's waters hold some of the western Indian Ocean's richest tuna and lobster grounds, but the catch is a fraction of the potential: small boats, no cold chain, and distant markets keep fishing artisanal. Proposals to develop Hobyo into a modern port — including the 2019 memorandum with Qatar — would, if realised, change the state's economic geography, giving central Somalia and eventually Ethiopia an eastern outlet.",
            "Meanwhile the real artery is tarmac and sand: the Mogadishu–Galkayo–Bosaso corridor. Every town of consequence in Galmudug sits on or near it, and trucking, fuel, khat distribution, and roadside trade employ a large share of the urban workforce.",
          ],
          so: [
            "Xeebtu waa rafaadka hurda ee dhaqaalaha. Biyaha Galmudug waxay hayaan qaar ka mid ah meelaha ugu hodansan tuunnada iyo aarggostada galbeedka Badweynta Hindiya, laakiin waxa la qabto waa qayb yar oo suurtagalka ah: doonyo yaryar, silsilad qabow oo aan jirin iyo suuqyo fog ayaa kalluumeysiga ku haya heer farsamo-gacmeed. Hindisayaasha Hobyo looga dhigayo deked casri ah — oo uu ku jiro heshiis-qorashadii Qatar ee 2019 — hadday hirgalaan waxay beddeli lahaayeen juqraafiga dhaqaale ee dowlad-goboleedka, iyagoo bartamaha Soomaaliya iyo ugu dambayn Itoobiya siinaya albaab bari ah.",
            "Inta ka horreysa, xididka dhabta ahi waa laami iyo carro: marinka Muqdisho–Gaalkacyo–Boosaaso. Magaalo kasta oo muhiim ah oo Galmudug ku taal isla waddadaas ayay saaran tahay ama u dhow dahay; gaadiidka, shidaalka, qaybinta qaadka iyo ganacsiga waddada-xeebteeda ayaa shaqaaleeya qayb weyn oo xoogsatada magaalooyinka ah.",
          ],
        },
      },
      {
        heading: {
          en: "Telecoms, money, and the diaspora",
          so: "Isgaarsiinta, lacagta iyo qurbajoogta",
        },
        body: {
          en: [
            "Somalia leapfrogged into mobile money, and Galmudug with it: everyday payments run over phone credit systems, and the money-transfer houses (hawala) that grew from the trust networks of the livestock trade now move remittances from the diaspora into every district. Those remittances — from communities in Minneapolis, London, Nairobi, and the Gulf — are the region's quiet fiscal system, funding consumption, schools, boreholes, and business start-ups alike.",
            "The formal state economy is small but growing: customs points, local taxation in the main towns, and federal transfers fund a young administration. The binding constraints are familiar — insecurity, drought, and roads — and every serious plan for the region begins with those three.",
          ],
          so: [
            "Soomaaliya waxay si boodhbood ah ugu gudubtay lacagta mobilka, Galmudugna way la socotay: lacag-bixinta maalinlaha ah waxay ku shaqaysaa nidaamyada taleefanka, guryaha xawilaadduna (xawaaladaha) — oo ka baxay shabakadihii kalsoonida ee ganacsiga xoolaha — waxay maanta qurbajoogta lacag uga soo gudbiyaan degmo kasta. Xawilaadahaas — ee ka yimaada bulshooyinka Minneapolis, London, Nayroobi iyo Khaliijka — waa nidaamka maaliyadeed ee aamusan ee gobolka: waxay maalgeliyaan nolol-maalmeedka, iskuullada, ceelasha iyo ganacsiyada curdinka ah.",
            "Dhaqaalaha rasmiga ah ee dowladdu waa yar yahay balse wuu koraya: goobo kastam, canshuur deegaan oo magaalooyinka waaweyn laga qaado, iyo wareejinta federaalku waxay maalgeliyaan maamul da' yar. Caqabadaha ugu waaweyni waa kuwo la yaqaan — ammaan-darro, abaar iyo waddooyin — qorshe kasta oo dhab ah oo gobolka loo sameeyana saddexdaas ayuu ka bilaabmaa.",
          ],
        },
      },
    ],
  },
  {
    slug: "travel",
    title: { en: "Travel & Diaspora", so: "Safar iyo Qurbajoog" },
    metaDescription: {
      en: "Practical notes on visiting Galmudug: getting there, moving around, money, timing, and guidance for the returning diaspora.",
      so: "Talooyin wax-ku-ool ah oo ku saabsan booqashada Galmudug: sida loo tago, dhaqdhaqaaqa, lacagta, xilliga iyo hagitaan qurbajoogta soo laabanaysa.",
    },
    intro: {
      en: "Most travellers to Galmudug are Somalis coming home — for family, weddings, business, or to see the land their parents described. These notes are written mainly for them, and for the careful visitor travelling with local knowledge. Conditions in central Somalia change; always take current local advice over anything written here.",
      so: "Inta badan dadka u safra Galmudug waa Soomaali guriga ku soo laabanaysa — qoys, aroos, ganacsi, ama inay arkaan dhulkii waalidkood ka sheekayn jiray. Qoraalladan waxaa loogu talagalay iyaga, iyo booqde taxaddar leh oo la socda aqoon deegaan. Xaaladaha bartamaha Soomaaliya way isbeddelaan; mar walba talada deegaanka ee hadda jirta ka hormari wax kasta oo halkan ku qoran.",
    },
    sections: [
      {
        heading: { en: "Getting there and around", so: "Sida loo tago iyo dhaqdhaqaaqa" },
        body: {
          en: [
            "The practical gateways are by air. Galkayo's airport receives regular domestic flights from Mogadishu and other Somali cities on local carriers, and Dhusamareb, Adado, and Guriel have airstrips with scheduled or charter service that varies by season. Most itineraries route through Mogadishu; some northern connections work through Bosaso or Djibouti.",
            "Overland, everything follows the main corridor road. Intercity travel is by 4x4 taxi convoys and buses between the main towns; journeys are long, hot, and best arranged through family or a trusted local fixer who knows the current state of the road. Security conditions differ sharply between districts and change with the news — check before every leg, not once per trip.",
          ],
          so: [
            "Albaabbada ugu macquulsan waa hawada. Garoonka Gaalkacyo waxaa ka dega duulimaadyo gudaha ah oo joogto ah oo ka yimaada Muqdisho iyo magaalooyin kale, iyadoo Dhuusamarreeb, Cadaado iyo Guriceel ay leeyihiin garoommo yaryar oo adeeggoodu xilli kala duwan yahay. Safarrada intooda badani waxay soo maraan Muqdisho; xiriirrada waqooyi qaarkood waxay shaqeeyaan Boosaaso ama Jabuuti.",
            "Dhulka, wax kastaa waxay raacaan waddada weyn ee marinka. Safarka magaalooyinka dhexdooda waxaa lagu qaadaa koox-koox gawaari 4x4 ah iyo basas; safarradu waa dheer yihiin, waa kulul yihiin, waxaana ugu fiican in lagu qabanqaabiyo qoys ama qof deegaan ah oo la aamini karo oo yaqaan xaaladda hadda ee waddada. Xaaladda ammaanku degmooyinka way ku kala duwan tahay, wararkana way la isbeddeshaa — safar kasta ka hor hubi, ha ahaan hal mar oo keliya.",
          ],
        },
      },
      {
        heading: { en: "Money, phones, and timing", so: "Lacagta, taleefanka iyo xilliga" },
        body: {
          en: [
            "The US dollar is the working currency for anything larger than a cup of tea; Somali shillings circulate for small change. In practice, nearly everything is paid by mobile money — get a local SIM on arrival and have a relative or hotel help register the payment service the same day. Cards are useless; hawala offices connect you to money worldwide.",
            "The kindest months are the Jilaal winter, December to February, when heat and humidity ease — and when the diaspora fills flights and wedding halls. The Gu rains (April–June) green the country beautifully but can cut unpaved roads. Dress modestly, ask before photographing people, accept the tea, and remember that in the towns of Galmudug your family name will often be known before you introduce yourself.",
          ],
          so: [
            "Doolarka Maraykanku waa lacagta wax-ka-qabadka ee wax kasta oo ka weyn koob shaah ah; shilinka Soomaaligu wuxuu u wareegaa baaqiga yar. Dhab ahaantii, ku dhowaad wax kastaa waxay ku bixiyaan lacag-mobil ah — sim deegaan qaado markaad timaado, qariib ama hudheelna ha kaa caawiyo diiwaangelinta adeegga lacagta isla maalintaas. Kaararka bangigu waxba kuma taraan; xafiisyada xawaaladduna waxay kugu xiraan lacag adduunka oo dhan ah.",
            "Bilaha ugu naxariista badani waa Jiilaalka, Diseembar ilaa Febraayo, marka kulaylka iyo huurku yaraadaan — welibana qurbajoogtu ay buuxiso duulimaadyada iyo hoolalka arooska. Roobabka Gu' (Abriil–Juun) dalka si qurux badan ayay u cagaariyaan, laakiin waddooyinka aan laamiga ahayn way goyn karaan. Si xishmad leh u labbiso, dadka ka weydiiso ka hor inta aadan sawirin, shaaha aqbal, xusuusnowna in magaalooyinka Galmudug magaca reerkaaga inta badan la yaqaan adiga ka hor intaadan is-baran.",
          ],
        },
      },
      {
        heading: { en: "For the returning diaspora", so: "Qurbajoogta soo laabanaysa" },
        body: {
          en: [
            "The diaspora is not a visitor here; it is half the economy and much of the leadership. Returnees fund and run schools, hospitals, and businesses across the state, and every district has its diaspora committee raising money for the next borehole or classroom. If you are returning to invest, the standing advice from those who have done it: come in person, start smaller than your plan, put agreements in writing witnessed by elders on all sides, and work through the local administration for anything touching land.",
            "Land is the classic pitfall — titles from different eras and authorities overlap, and absentee purchases go wrong often enough to be a proverb. The classic successes are services people pay for monthly: education, health, water, connectivity. Galmudug's towns are young, growing, and short of all four.",
          ],
          so: [
            "Qurbajoogtu halkan marti kuma aha; waa nus dhaqaalaha iyo in badan oo hoggaanka ah. Kuwa soo laabtay waxay maalgeliyaan oo maamulaan iskuullo, isbitaallo iyo ganacsiyo dowlad-goboleedka oo dhan ah, degmo kastana waxay leedahay guddi qurbajoog oo lacag u ururinaya ceelka ama fasalka xiga. Haddii aad ku soo laabanayso maalgashi, talada taagan ee kuwa horay u sameeyay: keligaa imow, ka yar bilow qorshahaaga, heshiisyada qor iyadoo odayaal dhinac kasta ka markhaati yihiin, wax kasta oo dhul taabanayana kala shaqee maamulka deegaanka.",
            "Dhulku waa godka caadiga ah ee lagu dhaco — waraaqo xilliyo iyo maamullo kala duwan ka soo baxay ayaa is-dul saaran, iibsashada fogaanta ahna marar badan ayay qaldantaa ilaa ay maahmaah noqotay. Guulaha caadiga ahi waa adeegyada dadku bishiiba lacag u bixiyaan: waxbarasho, caafimaad, biyo iyo isgaarsiin. Magaalooyinka Galmudug waa da'yar yihiin, way korayaan, afartaas oo dhanna way u baahan yihiin.",
          ],
        },
      },
    ],
  },
];

export function getRegionPage(slug: string): RegionPage | undefined {
  return REGION_PAGES.find((p) => p.slug === slug);
}
