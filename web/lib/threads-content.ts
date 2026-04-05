// Curated cultural and spiritual content for Threads of Home.
// All YouTube URLs use search queries (listType=search) so they remain
// resilient to video takedowns and respect cultural depth.

export type Song = {
  title: string;
  description: string;
  youtubeQuery: string;
};

export type Country = {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  intro: string;
  proverb: string;
  proverbSource: string;
  historyNote: string;
  /** Google News search query — used by /api/news to fetch headlines. */
  newsQuery: string;
  songs: Song[];
};

export type FullText = {
  title: string;
  url: string;
  host: string;
  note: string;
};

export type Religion = {
  id: string;
  name: string;
  icon: string;
  colorTone: "primary" | "secondary" | "tertiary";
  intro: string;
  sacredText: {
    title: string;
    excerpt: string;
    source: string;
  };
  prayer: {
    title: string;
    text: string;
  };
  /** Link out to a trusted online edition of the full text. */
  fullText: FullText;
  songs: Song[];
};

export const COUNTRIES: Country[] = [
  {
    id: "canada",
    name: "Canada",
    nativeName: "Canada · ᑲᓇᑕ",
    flag: "🇨🇦",
    intro:
      "The second-largest country on earth, with more coastline than any other. Home to First Nations, Inuit, and Métis peoples whose stories stretch back millennia, and to new arrivals from every corner of the world who now call it home.",
    proverb: "Ajuinnata.",
    proverbSource: "Inuktitut — \"Never give up. Commit to what matters, no matter how hard.\" Adopted as a guiding word by Governor General Mary Simon.",
    historyNote:
      "Long before the name \"Canada,\" Indigenous nations cared for this land through sophisticated governance, trade, and knowledge systems. The country was confederated in 1867 and has grown through waves of migration. Today's ongoing work of Truth and Reconciliation shapes how Canada understands its past and its future.",
    newsQuery: "Canada",
    songs: [
      {
        title: "O Canada",
        description: "The national anthem — sung in English, French, and many Indigenous languages.",
        youtubeQuery: "O Canada anthem bilingual",
      },
      {
        title: "Hallelujah — Leonard Cohen",
        description: "The most-covered Canadian song in the world. Quiet, aching, honest.",
        youtubeQuery: "Hallelujah Leonard Cohen original",
      },
      {
        title: "Strong Woman Song",
        description: "Composed by Indigenous women at Kingston Prison in the 1970s — sung at gatherings as a song of resilience.",
        youtubeQuery: "Strong Woman Song Indigenous drumming",
      },
    ],
  },
  {
    id: "philippines",
    name: "Philippines",
    nativeName: "Pilipinas",
    flag: "🇵🇭",
    intro:
      "Over 7,000 islands, more than 180 languages, and a culture woven from Malay, Spanish, Chinese, and Indigenous threads. Home of bayanihan — neighbours carrying each other's houses together.",
    proverb: "Ang hindi marunong lumingon sa pinanggalingan ay hindi makakarating sa paroroonan.",
    proverbSource: "Tagalog saying — \"One who does not look back to where they came from cannot reach where they are going.\"",
    historyNote:
      "The Philippines was home to seafaring civilisations long before the 1565 Spanish arrival. Independence came in 1946. The country has weathered typhoons, revolutions, and diaspora — and keeps singing through all of it.",
    newsQuery: "Philippines",
    songs: [
      {
        title: "Anak",
        description: "Freddie Aguilar's 1977 folk song about parents and children — the most translated Filipino song in history.",
        youtubeQuery: "Freddie Aguilar Anak original",
      },
      {
        title: "Dahil Sa Iyo",
        description: "A beloved kundiman, the classical Filipino love song form.",
        youtubeQuery: "Dahil Sa Iyo kundiman classic",
      },
      {
        title: "Bayan Ko",
        description: "A song of longing for homeland, sung across generations.",
        youtubeQuery: "Bayan Ko Filipino song",
      },
    ],
  },
  {
    id: "india",
    name: "India",
    nativeName: "भारत",
    flag: "🇮🇳",
    intro:
      "A civilisation 5,000 years deep — 22 official languages, countless regional ones, every major world religion born or welcomed here. The land of the Ganges, monsoon rains, and a thousand regional kitchens.",
    proverb: "अतिथि देवो भव।",
    proverbSource: "Sanskrit — \"The guest is God.\"",
    historyNote:
      "India gave the world zero, yoga, chess, and ahimsa (non-violence). Independence came in 1947 after a long non-violent resistance movement. Today it is the world's most populous nation.",
    newsQuery: "India",
    songs: [
      {
        title: "Vande Mataram",
        description: "The patriotic song that accompanied India's freedom struggle.",
        youtubeQuery: "Vande Mataram original AR Rahman",
      },
      {
        title: "Lag Jaa Gale",
        description: "Lata Mangeshkar's 1964 ballad — timeless across generations.",
        youtubeQuery: "Lag Jaa Gale Lata Mangeshkar",
      },
      {
        title: "Raghupati Raghava Raja Ram",
        description: "Gandhi's favourite bhajan, a hymn of peace.",
        youtubeQuery: "Raghupati Raghava Raja Ram bhajan",
      },
    ],
  },
  {
    id: "china",
    name: "China",
    nativeName: "中国",
    flag: "🇨🇳",
    intro:
      "Four thousand years of continuous civilisation, 56 recognised ethnicities, and a cuisine that differs every 100 kilometres. Home of tea, silk, printing, and the compass.",
    proverb: "千里之行，始于足下",
    proverbSource: "Lao Tzu — \"A journey of a thousand miles begins with a single step.\"",
    historyNote:
      "From the Shang dynasty to today, China's story is told through calligraphy, poetry, and philosophy. Confucian, Taoist, and Buddhist threads run through daily life.",
    newsQuery: "China",
    songs: [
      {
        title: "茉莉花 (Jasmine Flower)",
        description: "A folk song from the Qing dynasty, now loved worldwide.",
        youtubeQuery: "茉莉花 Jasmine Flower Chinese folk",
      },
      {
        title: "月亮代表我的心 (The Moon Represents My Heart)",
        description: "Teresa Teng's 1977 ballad — one of the most beloved Chinese songs ever recorded.",
        youtubeQuery: "月亮代表我的心 Teresa Teng",
      },
      {
        title: "童年 (Childhood)",
        description: "Lo Ta-yu's 1982 song about small memories that stay with us.",
        youtubeQuery: "童年 羅大佑 Lo Ta-yu",
      },
    ],
  },
  {
    id: "mexico",
    name: "Mexico",
    nativeName: "México",
    flag: "🇲🇽",
    intro:
      "Aztec, Maya, Zapotec, Spanish, and African roots braided into one country. Land of the monarch butterfly migration, Frida Kahlo, Day of the Dead, and the taco.",
    proverb: "El que busca, encuentra.",
    proverbSource: "Mexican saying — \"The one who searches, finds.\"",
    historyNote:
      "Mexico's Indigenous civilisations built cities of astonishing mathematical precision. After independence in 1821 and revolution in 1910, the country keeps reinventing itself.",
    newsQuery: "Mexico",
    songs: [
      {
        title: "Cielito Lindo",
        description: "The song every Mexican knows — \"Canta y no llores\" (sing, don't cry).",
        youtubeQuery: "Cielito Lindo mariachi original",
      },
      {
        title: "La Llorona",
        description: "The haunting folk ballad, made famous by Chavela Vargas.",
        youtubeQuery: "La Llorona Chavela Vargas",
      },
      {
        title: "México Lindo y Querido",
        description: "Jorge Negrete's love song to the country.",
        youtubeQuery: "Mexico Lindo y Querido Jorge Negrete",
      },
    ],
  },
  {
    id: "vietnam",
    name: "Vietnam",
    nativeName: "Việt Nam",
    flag: "🇻🇳",
    intro:
      "S-shaped country of rice terraces, limestone karsts, and 54 ethnic groups. Four thousand years of stories, from the Hùng Kings to today.",
    proverb: "Ăn quả nhớ kẻ trồng cây.",
    proverbSource: "Vietnamese saying — \"When eating fruit, remember the one who planted the tree.\"",
    historyNote:
      "Vietnam has survived a thousand years of Chinese rule, French colonisation, and war — and remains deeply family-centred, with ancestors honoured at home altars.",
    newsQuery: "Vietnam",
    songs: [
      {
        title: "Lòng Mẹ (Mother's Heart)",
        description: "Y Vân's 1955 song about a mother's love — asked for at every family gathering.",
        youtubeQuery: "Lòng Mẹ Y Vân Vietnamese",
      },
      {
        title: "Diễm Xưa",
        description: "Trịnh Công Sơn's rain-soaked ballad of memory.",
        youtubeQuery: "Diễm Xưa Trịnh Công Sơn Khánh Ly",
      },
      {
        title: "Trống Cơm",
        description: "A playful Vietnamese folk song about a drum.",
        youtubeQuery: "Trống Cơm Vietnamese folk song",
      },
    ],
  },
  {
    id: "iran",
    name: "Iran",
    nativeName: "ایران",
    flag: "🇮🇷",
    intro:
      "Persia — the ancient name. Home of Rumi, Hafez, the garden as a sacred space, and the concept of ta'arof (the art of polite insistence).",
    proverb: "تا باد چنین بادا",
    proverbSource: "Persian saying — \"May this good wind continue to blow.\"",
    historyNote:
      "Persian civilisation stretches back 2,500 years. Poetry is not a hobby here — it is part of ordinary life. Hafez's tomb in Shiraz is visited daily by people reading his verses for guidance.",
    newsQuery: "Iran",
    songs: [
      {
        title: "Gole Sangam",
        description: "Hayedeh's beloved ballad — the stone flower.",
        youtubeQuery: "Hayedeh Gole Sangam Persian",
      },
      {
        title: "Soltane Ghalbha",
        description: "Aref's classic — the king of hearts.",
        youtubeQuery: "Soltane Ghalbha Aref Persian classic",
      },
      {
        title: "Morghe Sahar",
        description: "The bird of dawn — a song of hope used across generations.",
        youtubeQuery: "Morghe Sahar Persian song",
      },
    ],
  },
  {
    id: "korea",
    name: "Korea",
    nativeName: "한국",
    flag: "🇰🇷",
    intro:
      "Peninsula of mountains, rice paddies, and han — a word for deep collective sorrow that has no English equivalent. Home of hangul, kimchi, and jeong (loyalty through shared hardship).",
    proverb: "시작이 반이다",
    proverbSource: "Korean saying — \"Starting is half.\"",
    historyNote:
      "Korea has existed as a distinct culture for over 2,000 years. King Sejong created hangul in 1443 so that common people could read. Today, Korean storytelling reaches the whole world.",
    newsQuery: "South Korea",
    songs: [
      {
        title: "아리랑 (Arirang)",
        description: "Korea's unofficial anthem — every Korean knows it by heart.",
        youtubeQuery: "Arirang Korean folk song original",
      },
      {
        title: "고향의 봄 (Spring of My Hometown)",
        description: "A 1926 song every schoolchild learns.",
        youtubeQuery: "고향의 봄 Korean song",
      },
      {
        title: "사랑은 은하수 (Love is the Milky Way)",
        description: "A classic Korean ballad.",
        youtubeQuery: "Korean classic ballad 사랑",
      },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    nativeName: "日本",
    flag: "🇯🇵",
    intro:
      "Islands of cherry blossoms and tsunami survivors. Where wabi-sabi (beauty in imperfection) shapes everything from pottery to poetry.",
    proverb: "七転び八起き",
    proverbSource: "Japanese saying — \"Fall down seven times, get up eight.\"",
    historyNote:
      "Japan's culture fuses Shinto, Buddhism, and a deep attention to craft. From the Heian court poets to today, small moments of beauty are taken seriously.",
    newsQuery: "Japan",
    songs: [
      {
        title: "上を向いて歩こう (Ue wo Muite Arukō)",
        description: "Kyu Sakamoto's 1961 song — known in the West as \"Sukiyaki\".",
        youtubeQuery: "Ue wo Muite Arukō Kyu Sakamoto original",
      },
      {
        title: "さくら さくら (Sakura Sakura)",
        description: "The cherry blossom folk song, timeless and gentle.",
        youtubeQuery: "Sakura Sakura Japanese folk song traditional",
      },
      {
        title: "川の流れのように (Kawa no Nagare no Yō ni)",
        description: "Hibari Misora's final masterpiece — life flows like a river.",
        youtubeQuery: "川の流れのように 美空ひばり",
      },
    ],
  },
  {
    id: "pakistan",
    name: "Pakistan",
    nativeName: "پاکستان",
    flag: "🇵🇰",
    intro:
      "Land of five rivers, Sufi shrines, qawwali music, and the Hindu Kush mountains. A country of many languages — Urdu, Punjabi, Sindhi, Pashto, Balochi.",
    proverb: "انسان اپنی قدر خود بناتا ہے",
    proverbSource: "Urdu saying — \"A person creates their own worth.\"",
    historyNote:
      "Pakistan was formed in 1947. Its poetic tradition — from Allama Iqbal to Faiz Ahmed Faiz — is carried through everyday speech.",
    newsQuery: "Pakistan",
    songs: [
      {
        title: "Tajdar-e-Haram",
        description: "Nusrat Fateh Ali Khan's most beloved qawwali.",
        youtubeQuery: "Tajdar-e-Haram Nusrat Fateh Ali Khan original",
      },
      {
        title: "Afreen Afreen",
        description: "Nusrat's classic — praise of beauty.",
        youtubeQuery: "Afreen Afreen Nusrat Fateh Ali Khan",
      },
      {
        title: "Dil Dil Pakistan",
        description: "Vital Signs' 1987 anthem that became the people's song.",
        youtubeQuery: "Dil Dil Pakistan Vital Signs",
      },
    ],
  },
  {
    id: "afghanistan",
    name: "Afghanistan",
    nativeName: "افغانستان",
    flag: "🇦🇫",
    intro:
      "Crossroads of empires and the Silk Road. Home of Rumi's birthplace (Balkh), nan bread, mulberries, and a poetic tradition that has outlasted every conquest.",
    proverb: "قطره قطره دریا می‌شود",
    proverbSource: "Dari saying — \"Drop by drop, a river is made.\"",
    historyNote:
      "Afghanistan's culture is older than any of its borders. Through decades of upheaval, music, poetry, and family bonds remain.",
    newsQuery: "Afghanistan",
    songs: [
      {
        title: "Ahmad Zahir Classics",
        description: "The \"Afghan Elvis\" — romantic ballads loved by every generation.",
        youtubeQuery: "Ahmad Zahir classic Afghan song",
      },
      {
        title: "Sarzamin-e Man (My Homeland)",
        description: "A song of longing for Afghanistan.",
        youtubeQuery: "Sarzamin-e Man Afghan song",
      },
      {
        title: "Rumi in Song",
        description: "Settings of Rumi's poetry in Persian/Dari.",
        youtubeQuery: "Rumi poetry Persian music Dari",
      },
    ],
  },
  {
    id: "syria",
    name: "Syria",
    nativeName: "سوريا",
    flag: "🇸🇾",
    intro:
      "Home of Damascus — one of the oldest continuously inhabited cities on Earth. Where jasmine drapes stone walls and hospitality is a sacred duty.",
    proverb: "الجار قبل الدار",
    proverbSource: "Arabic saying — \"The neighbour comes before the house.\"",
    historyNote:
      "Syria has been a meeting place of civilisations for 10,000 years. Aramaic, the language Jesus spoke, is still alive in villages like Ma'loula.",
    newsQuery: "Syria",
    songs: [
      {
        title: "Ya Mal El Sham",
        description: "Sabah Fakhri's tribute to Damascus.",
        youtubeQuery: "Ya Mal El Sham Sabah Fakhri",
      },
      {
        title: "Damascus Songs — Fairuz",
        description: "The voice of the Arab world singing about Damascus.",
        youtubeQuery: "Fairuz Damascus Sham song",
      },
      {
        title: "Wahdon (Alone)",
        description: "Fairuz's quiet ballad for the ones who carry on.",
        youtubeQuery: "Wahdon Fairuz Arabic song",
      },
    ],
  },
  {
    id: "somalia",
    name: "Somalia",
    nativeName: "Soomaaliya",
    flag: "🇸🇴",
    intro:
      "The nation of poets — Somalis memorise thousands of lines of gabay poetry. Land of camel herders, the Horn of Africa, and a rich oral tradition.",
    proverb: "Nin walba waa sheeko.",
    proverbSource: "Somali saying — \"Every person is a story.\"",
    historyNote:
      "Somali culture prized poetry above almost everything else for centuries. A good poem could end a war, start a marriage, or preserve a family's history.",
    newsQuery: "Somalia",
    songs: [
      {
        title: "Classical Somali Songs",
        description: "The golden era of Somali music — 1970s and 80s ballads.",
        youtubeQuery: "Somali classic music golden era",
      },
      {
        title: "Heeso Somali",
        description: "Traditional Somali songs sung at gatherings.",
        youtubeQuery: "Heeso Somali traditional songs",
      },
      {
        title: "Waaberi",
        description: "Songs from the legendary Somali musical collective.",
        youtubeQuery: "Waaberi Somali music group",
      },
    ],
  },
  {
    id: "ukraine",
    name: "Ukraine",
    nativeName: "Україна",
    flag: "🇺🇦",
    intro:
      "Land of wheat fields, black earth, embroidered vyshyvanka shirts, and a song tradition so deep that UNESCO recognises Ukrainian embroidery and bread-making as heritage.",
    proverb: "За двома зайцями поженешся — жодного не впіймаєш.",
    proverbSource: "Ukrainian saying — \"Chase two hares, catch none.\"",
    historyNote:
      "Ukraine's culture is ancient — Kyivan Rus' predates most modern nations. Through every trial, songs and embroidered shirts keep families together.",
    newsQuery: "Ukraine",
    songs: [
      {
        title: "Chervona Kalyna (Red Viburnum)",
        description: "A folk song that became a symbol of Ukrainian resilience.",
        youtubeQuery: "Chervona Kalyna Ukrainian folk song",
      },
      {
        title: "Oy u luzi chervona kalyna",
        description: "Traditional Ukrainian folk ballad.",
        youtubeQuery: "Oy u luzi chervona kalyna traditional",
      },
      {
        title: "Nich Yaka Misyachna",
        description: "A Ukrainian night-time love song.",
        youtubeQuery: "Nich Yaka Misyachna Ukrainian song",
      },
    ],
  },
  {
    id: "ethiopia",
    name: "Ethiopia",
    nativeName: "ኢትዮጵያ",
    flag: "🇪🇹",
    intro:
      "The only African nation that was never colonised. Home of coffee, injera, the Ethiopian calendar (13 months), and one of the oldest Christian churches in the world.",
    proverb: "ዝንብ የምትወዳት አንዱ ሰው ልጇ ናት።",
    proverbSource: "Ethiopian saying — \"A fly has one person she loves — her child.\"",
    historyNote:
      "Ethiopia's alphabet is 2,000 years old. Its rock-hewn churches at Lalibela were carved in the 12th century from single stones.",
    newsQuery: "Ethiopia",
    songs: [
      {
        title: "Tizita",
        description: "The Ethiopian blues — songs of longing and memory.",
        youtubeQuery: "Tizita Ethiopian song Mahmoud Ahmed",
      },
      {
        title: "Mulatu Astatke — Ethiopian Jazz",
        description: "The father of Ethio-jazz.",
        youtubeQuery: "Mulatu Astatke Ethiopian jazz",
      },
      {
        title: "Aster Aweke Classics",
        description: "One of Ethiopia's most beloved singers.",
        youtubeQuery: "Aster Aweke classic Ethiopian",
      },
    ],
  },
  {
    id: "colombia",
    name: "Colombia",
    nativeName: "Colombia",
    flag: "🇨🇴",
    intro:
      "From Caribbean coast to Amazon rainforest to Andean peaks — one country, every climate. Home of Gabriel García Márquez, cumbia, arepas, and coffee grown in the mountains.",
    proverb: "Poco a poco se llega lejos.",
    proverbSource: "Colombian saying — \"Little by little, you go far.\"",
    historyNote:
      "Colombia's Indigenous, African, and Spanish heritage created its vibrant music. García Márquez turned everyday Colombian life into magical realism.",
    newsQuery: "Colombia",
    songs: [
      {
        title: "La Pollera Colorá",
        description: "The unofficial anthem of cumbia.",
        youtubeQuery: "La Pollera Colorá cumbia Colombian",
      },
      {
        title: "Colombia Tierra Querida",
        description: "Lucho Bermúdez's love song for Colombia.",
        youtubeQuery: "Colombia Tierra Querida Lucho Bermudez",
      },
      {
        title: "Te Busco",
        description: "Cumbia ballads from the golden age.",
        youtubeQuery: "cumbia colombiana clasica",
      },
    ],
  },
  {
    id: "nigeria",
    name: "Nigeria",
    nativeName: "Nigeria",
    flag: "🇳🇬",
    intro:
      "250+ ethnic groups, 500+ languages, Nollywood (the world's second-largest film industry), and the birthplace of Afrobeat.",
    proverb: "A kii maa gbe ibi kan ka ma ri nkan.",
    proverbSource: "Yoruba saying — \"One who stays in one place sees nothing.\"",
    historyNote:
      "Nigeria's Yoruba, Igbo, and Hausa civilisations built kingdoms that traded across the Sahara. Today Nigerian music shapes global pop.",
    newsQuery: "Nigeria",
    songs: [
      {
        title: "Water No Get Enemy — Fela Kuti",
        description: "The Afrobeat pioneer's classic.",
        youtubeQuery: "Water No Get Enemy Fela Kuti",
      },
      {
        title: "Sweet Mother — Prince Nico Mbarga",
        description: "Africa's most successful song ever recorded.",
        youtubeQuery: "Sweet Mother Prince Nico Mbarga",
      },
      {
        title: "Ijo Ya — King Sunny Adé",
        description: "The king of juju music.",
        youtubeQuery: "King Sunny Ade juju music Nigerian",
      },
    ],
  },
];

export const RELIGIONS: Religion[] = [
  {
    id: "christianity",
    name: "Christianity",
    icon: "church",
    colorTone: "primary",
    intro:
      "Two billion people across every continent. From ancient Orthodox liturgies to Pentecostal worship to quiet Quaker silence — many forms of one faith.",
    sacredText: {
      title: "Psalm 46:1, 10",
      excerpt:
        "God is our refuge and strength, a very present help in trouble… Be still, and know that I am God.",
      source: "Hebrew Bible / Old Testament",
    },
    prayer: {
      title: "A gentle centering prayer",
      text:
        "Sit quietly. Breathe slowly. Let one word hold you — peace, home, held, loved. When your mind wanders, simply return to the word.",
    },
    fullText: {
      title: "The Bible — read full chapters",
      url: "https://www.biblegateway.com/passage/?search=Psalm+46&version=NIV",
      host: "biblegateway.com",
      note: "Opens Psalm 46 in the NIV translation. From here you can switch translations or browse any book of the Bible.",
    },
    songs: [
      {
        title: "Amazing Grace",
        description: "The 1772 hymn written by a man who survived his own storms.",
        youtubeQuery: "Amazing Grace hymn traditional",
      },
      {
        title: "Be Still My Soul",
        description: "A hymn for heavy days.",
        youtubeQuery: "Be Still My Soul hymn Finlandia",
      },
      {
        title: "How Great Thou Art",
        description: "A worship classic sung across denominations.",
        youtubeQuery: "How Great Thou Art hymn",
      },
    ],
  },
  {
    id: "islam",
    name: "Islam",
    icon: "mosque",
    colorTone: "secondary",
    intro:
      "Nearly two billion Muslims across the world. A faith built on five daily prayers, compassion for the poor, and the belief that God is Ar-Rahman — the most merciful.",
    sacredText: {
      title: "Qur'an 94:5-6",
      excerpt:
        "Indeed, with hardship comes ease. Indeed, with hardship comes ease. (فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا)",
      source: "Surah Ash-Sharh",
    },
    prayer: {
      title: "A simple dua for difficult moments",
      text:
        "Hasbunallahu wa ni'mal wakeel — Allah is sufficient for us, and He is the best disposer of affairs. Repeat this slowly, as many times as you need.",
    },
    fullText: {
      title: "The Qur'an — read any surah",
      url: "https://quran.com/94",
      host: "quran.com",
      note: "Opens Surah Ash-Sharh with Arabic, translation, and recitation. You can browse all 114 surahs from here.",
    },
    songs: [
      {
        title: "Tala' al Badru Alayna",
        description: "The oldest surviving Islamic song, sung to welcome the Prophet to Medina.",
        youtubeQuery: "Tala al Badru Alayna nasheed traditional",
      },
      {
        title: "Asma ul Husna (99 Names)",
        description: "A recitation of Allah's beautiful names.",
        youtubeQuery: "Asma ul Husna 99 names nasheed",
      },
      {
        title: "Ya Nabi Salam Alayka",
        description: "A traditional salutation.",
        youtubeQuery: "Ya Nabi Salam Alayka nasheed",
      },
    ],
  },
  {
    id: "hinduism",
    name: "Hinduism",
    icon: "auto_awesome",
    colorTone: "tertiary",
    intro:
      "One of the oldest living spiritual traditions. Many paths (bhakti, karma, jnana), many deities, one underlying understanding — that the divine is present in every breath.",
    sacredText: {
      title: "Bhagavad Gita 2:47",
      excerpt:
        "You have the right to work, but never to the fruit of work. Do your duty, without attachment to the results.",
      source: "Bhagavad Gita",
    },
    prayer: {
      title: "Om Shanti meditation",
      text:
        "Sit with your spine easy. Say softly: Om Shanti, Shanti, Shanti — peace in mind, peace in body, peace in the world. Let the third Shanti dissolve into silence.",
    },
    fullText: {
      title: "Bhagavad Gita — read verse by verse",
      url: "https://www.holy-bhagavad-gita.org/chapter/2/verse/47",
      host: "holy-bhagavad-gita.org",
      note: "Opens Chapter 2, Verse 47 with Sanskrit, transliteration, translation, and commentary. All 18 chapters are here.",
    },
    songs: [
      {
        title: "Raghupati Raghava Raja Ram",
        description: "Gandhi's favourite bhajan — a song of unity.",
        youtubeQuery: "Raghupati Raghava Raja Ram bhajan",
      },
      {
        title: "Hanuman Chalisa",
        description: "The 40-verse prayer that millions recite daily for strength.",
        youtubeQuery: "Hanuman Chalisa traditional",
      },
      {
        title: "Om Namah Shivaya",
        description: "The five-syllable mantra of Shiva.",
        youtubeQuery: "Om Namah Shivaya chant meditation",
      },
    ],
  },
  {
    id: "buddhism",
    name: "Buddhism",
    icon: "self_improvement",
    colorTone: "primary",
    intro:
      "2,500 years old. Not a faith in a god but a path of waking up — of seeing clearly, caring deeply, and releasing the grip of suffering.",
    sacredText: {
      title: "Metta (Loving-kindness)",
      excerpt:
        "May I be safe. May I be peaceful. May I be healthy. May I live with ease. (Now, extend this to others.)",
      source: "Metta Sutta",
    },
    prayer: {
      title: "Breath-in-breath-out meditation",
      text:
        "Breathe in and silently say: calm. Breathe out and say: ease. Continue for as long as feels right. There is no goal — just the breath.",
    },
    fullText: {
      title: "Buddhist suttas — in plain English",
      url: "https://suttacentral.net/snp1.8/en/sujato",
      host: "suttacentral.net",
      note: "Opens the Metta Sutta (loving-kindness discourse) in modern translation. From here you can browse the full Pali canon.",
    },
    songs: [
      {
        title: "Om Mani Padme Hum",
        description: "The six-syllable mantra of compassion.",
        youtubeQuery: "Om Mani Padme Hum chant meditation",
      },
      {
        title: "Heart Sutra",
        description: "Ancient Buddhist chant of emptiness and compassion.",
        youtubeQuery: "Heart Sutra chant traditional",
      },
      {
        title: "Tibetan Singing Bowls",
        description: "Sound meditation for rest.",
        youtubeQuery: "Tibetan singing bowls meditation",
      },
    ],
  },
  {
    id: "sikhism",
    name: "Sikhism",
    icon: "temple_hindu",
    colorTone: "secondary",
    intro:
      "Founded by Guru Nanak 500 years ago. A faith of equality, service (seva), and remembering God's name. The langar — free community kitchen — feeds millions daily.",
    sacredText: {
      title: "Mool Mantar",
      excerpt:
        "Ik Onkar — There is One God. Satnam — Truth is the name. Karta Purakh — The Creator.",
      source: "Guru Granth Sahib",
    },
    prayer: {
      title: "Waheguru meditation",
      text:
        "Breathe in: Wahe. Breathe out: Guru. Repeat slowly. \"Waheguru\" means \"Wonderful Teacher\" — an expression of awe at the divine.",
    },
    fullText: {
      title: "Guru Granth Sahib — search by shabad",
      url: "https://www.sikhitothemax.org/",
      host: "sikhitothemax.org",
      note: "Browse and search the Guru Granth Sahib in Gurmukhi with English translations and transliterations.",
    },
    songs: [
      {
        title: "Gurbani Shabad",
        description: "Traditional Sikh hymns from the Guru Granth Sahib.",
        youtubeQuery: "Gurbani Shabad kirtan peaceful",
      },
      {
        title: "Japji Sahib",
        description: "Guru Nanak's morning prayer.",
        youtubeQuery: "Japji Sahib recitation",
      },
      {
        title: "Sukhmani Sahib",
        description: "The prayer of peace.",
        youtubeQuery: "Sukhmani Sahib recitation",
      },
    ],
  },
  {
    id: "judaism",
    name: "Judaism",
    icon: "synagogue",
    colorTone: "tertiary",
    intro:
      "A 4,000-year conversation between a people and the divine. Shaped by questioning, study, Shabbat rest, and the belief that repairing the world (tikkun olam) is sacred work.",
    sacredText: {
      title: "Psalm 23",
      excerpt:
        "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures; He leads me beside still waters; He restores my soul.",
      source: "Book of Psalms",
    },
    prayer: {
      title: "Modeh Ani (morning blessing)",
      text:
        "Modeh ani lefanecha — I give thanks to You, for You have returned my soul to me. Say this upon waking, as a simple acknowledgment that today is a gift.",
    },
    fullText: {
      title: "Tanakh & Talmud — open library",
      url: "https://www.sefaria.org/Psalms.23?lang=bi",
      host: "sefaria.org",
      note: "Opens Psalm 23 in Hebrew and English side by side. Sefaria holds the full Tanakh, Talmud, Midrash, and more.",
    },
    songs: [
      {
        title: "Oseh Shalom",
        description: "\"May the One who makes peace...\" — the closing prayer.",
        youtubeQuery: "Oseh Shalom Jewish prayer song",
      },
      {
        title: "Hinei Mah Tov",
        description: "A joyful song of togetherness.",
        youtubeQuery: "Hinei Mah Tov Jewish folk song",
      },
      {
        title: "Shalom Aleichem",
        description: "The Friday night Shabbat welcoming song.",
        youtubeQuery: "Shalom Aleichem Shabbat song",
      },
    ],
  },
  {
    id: "secular",
    name: "Secular & Spiritual",
    icon: "spa",
    colorTone: "primary",
    intro:
      "For those who hold no specific faith, or who find meaning in many places — in nature, poetry, silence, or the simple fact of being alive today.",
    sacredText: {
      title: "Mary Oliver, \"The Summer Day\"",
      excerpt:
        "Tell me, what is it you plan to do with your one wild and precious life?",
      source: "Mary Oliver",
    },
    prayer: {
      title: "A simple grounding practice",
      text:
        "Sit quietly. Notice your feet on the ground. Notice three things you can see. Notice your breath moving in and out. You are here. That is enough for now.",
    },
    fullText: {
      title: "Mary Oliver — read her poems",
      url: "https://www.poetryfoundation.org/poets/mary-oliver",
      host: "poetryfoundation.org",
      note: "Browse Mary Oliver's poems — and thousands of others — from the Poetry Foundation's free archive.",
    },
    songs: [
      {
        title: "What a Wonderful World",
        description: "Louis Armstrong's reminder that the ordinary is extraordinary.",
        youtubeQuery: "What a Wonderful World Louis Armstrong original",
      },
      {
        title: "Here Comes the Sun",
        description: "A song for when the heavy winter starts to lift.",
        youtubeQuery: "Here Comes the Sun Beatles acoustic",
      },
      {
        title: "Nature Sounds for Rest",
        description: "Rain, forest, and ocean sounds for quiet moments.",
        youtubeQuery: "nature sounds meditation rain forest",
      },
    ],
  },
];
