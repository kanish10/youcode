export type ResourceCategory = "mental" | "food" | "housing" | "safety" | "counselling" | "employment";

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  phone?: string;
  address?: string;
  city: string;
  hours?: string;
  languages: string[];
  description: string;
  latitude: number;
  longitude: number;
}

export const RESOURCE_CATEGORIES: {
  id: ResourceCategory | "all";
  labelKey: string;
  icon: string;
  color: string;
  descKey: string;
  tagKey: string;
  bgClass: string;
  iconBgClass: string;
  tagClass: string;
}[] = [
  { id: "all", labelKey: "resources.allCategories", icon: "apps", color: "text-on-surface", descKey: "", tagKey: "", bgClass: "", iconBgClass: "", tagClass: "" },
  {
    id: "mental", labelKey: "resources.catMental", icon: "psychology", color: "text-tertiary",
    descKey: "resources.mentalDesc", tagKey: "resources.mentalTag",
    bgClass: "bg-tertiary-container/20", iconBgClass: "bg-tertiary-container text-tertiary", tagClass: "bg-tertiary-container/50 text-tertiary",
  },
  {
    id: "food", labelKey: "resources.catFood", icon: "restaurant", color: "text-secondary",
    descKey: "resources.foodDesc", tagKey: "resources.foodTag",
    bgClass: "bg-secondary-container/20", iconBgClass: "bg-secondary-container text-secondary", tagClass: "bg-secondary-container/50 text-secondary",
  },
  {
    id: "housing", labelKey: "resources.catHousing", icon: "home_work", color: "text-primary",
    descKey: "resources.housingDesc", tagKey: "resources.housingTag",
    bgClass: "bg-primary-container/20", iconBgClass: "bg-primary-container text-primary", tagClass: "bg-primary-container/50 text-primary",
  },
  {
    id: "safety", labelKey: "resources.catSafety", icon: "security", color: "text-error",
    descKey: "resources.safetyDesc", tagKey: "resources.safetyTag",
    bgClass: "bg-error-container/15", iconBgClass: "bg-error-container/40 text-error", tagClass: "bg-error-container/40 text-error",
  },
  {
    id: "counselling", labelKey: "resources.catCounselling", icon: "support_agent", color: "text-tertiary",
    descKey: "resources.mentalDesc", tagKey: "resources.mentalTag",
    bgClass: "bg-tertiary-container/15", iconBgClass: "bg-tertiary-container text-tertiary", tagClass: "bg-tertiary-container/50 text-tertiary",
  },
  {
    id: "employment", labelKey: "resources.catEmployment", icon: "work", color: "text-secondary",
    descKey: "resources.foodDesc", tagKey: "resources.housingTag",
    bgClass: "bg-secondary-container/15", iconBgClass: "bg-secondary-container text-secondary", tagClass: "bg-secondary-container/50 text-secondary",
  },
];

export const RESOURCES: Resource[] = [
  // ── Mental Health ──
  {
    id: "bc-crisis-centre",
    name: "BC Crisis Centre",
    category: "mental",
    phone: "1-800-784-2433",
    address: "763 E Broadway",
    city: "Vancouver",
    hours: "24/7",
    languages: ["English", "French", "Mandarin", "Punjabi", "Cantonese"],
    description: "24-hour crisis intervention, emotional support and suicide prevention.",
    latitude: 49.2627, longitude: -123.0886,
  },
  {
    id: "bc211",
    name: "BC211 Information & Referral",
    category: "mental",
    phone: "211",
    address: "Online / Phone",
    city: "Province-wide",
    hours: "24/7",
    languages: ["English", "French", "150+ via interpretation"],
    description: "Free confidential help connecting people with community, social, and government services.",
    latitude: 49.2827, longitude: -123.1207,
  },
  {
    id: "crisis-text-line",
    name: "Crisis Text Line",
    category: "mental",
    phone: "Text HOME to 686868",
    address: "Text-based Service",
    city: "Province-wide",
    hours: "24/7",
    languages: ["English", "French"],
    description: "Free, 24/7 crisis support via text message. Trained crisis counsellors.",
    latitude: 49.2827, longitude: -123.1207,
  },
  {
    id: "cmha-vancouver",
    name: "Canadian Mental Health Association – Vancouver",
    category: "mental",
    phone: "604-872-4902",
    address: "110-2425 Quebec St",
    city: "Vancouver",
    hours: "Mon-Fri 9am-5pm",
    languages: ["English", "Mandarin", "Cantonese"],
    description: "Mental health programs, peer support groups, and psychosocial rehabilitation.",
    latitude: 49.2621, longitude: -123.1018,
  },

  // ── Food Security ──
  {
    id: "gathering-place",
    name: "The Gathering Place Community Centre",
    category: "food",
    phone: "604-665-2391",
    address: "609 Helmcken St",
    city: "Vancouver",
    hours: "Mon-Fri 8:30am-9:30pm, Sat-Sun 9am-5pm",
    languages: ["English", "French", "Mandarin"],
    description: "Free meals, showers, laundry, and recreation programs for low-income individuals.",
    latitude: 49.2769, longitude: -123.1222,
  },
  {
    id: "vancouver-food-bank",
    name: "Greater Vancouver Food Bank",
    category: "food",
    phone: "604-876-3601",
    address: "1150 Raymur Ave",
    city: "Vancouver",
    hours: "Mon-Fri 9am-4pm",
    languages: ["English", "Mandarin", "Punjabi"],
    description: "Emergency food hampers, community kitchens, and seasonal food programs.",
    latitude: 49.2787, longitude: -123.0786,
  },
  {
    id: "downtown-eastside-womens",
    name: "Downtown Eastside Women's Centre",
    category: "food",
    phone: "604-681-8480",
    address: "302 Columbia St",
    city: "Vancouver",
    hours: "Mon-Fri 9:30am-9pm, Sat 12-5pm",
    languages: ["English"],
    description: "Drop-in centre providing meals, clothing, advocacy, and a safe space for women.",
    latitude: 49.2822, longitude: -123.0994,
  },
  {
    id: "kiwassa-neighbourhood",
    name: "Kiwassa Neighbourhood House",
    category: "food",
    phone: "604-254-5401",
    address: "2425 Oxford St",
    city: "Vancouver",
    hours: "Mon-Fri 9am-9pm, Sat 9am-5pm",
    languages: ["English", "Mandarin", "Vietnamese"],
    description: "Community kitchen, food security programs, settlement services, and family programs.",
    latitude: 49.2756, longitude: -123.0602,
  },
  {
    id: "quest-food-exchange",
    name: "Quest Food Exchange",
    category: "food",
    phone: "604-421-7663",
    address: "310-7000 Lougheed Hwy",
    city: "Burnaby",
    hours: "Mon-Sat 10am-5pm",
    languages: ["English"],
    description: "Affordable grocery store and food hampers for low-income families and individuals.",
    latitude: 49.2677, longitude: -122.9891,
  },

  // ── Housing & Legal ──
  {
    id: "atira-womens",
    name: "Atira Women's Resource Society",
    category: "housing",
    phone: "604-331-1407",
    address: "101 E Cordova St",
    city: "Vancouver",
    hours: "Mon-Fri 9am-5pm",
    languages: ["English", "French", "Spanish"],
    description: "Housing, support services, and advocacy for women and children affected by violence.",
    latitude: 49.2824, longitude: -123.0991,
  },
  {
    id: "legal-services",
    name: "Legal Services Society BC",
    category: "housing",
    phone: "604-408-2172",
    address: "400-510 Burrard St",
    city: "Vancouver",
    hours: "Mon-Fri 9am-4pm",
    languages: ["English", "French", "Mandarin", "Punjabi", "Spanish", "Arabic"],
    description: "Free legal information and representation for low-income individuals.",
    latitude: 49.2851, longitude: -123.1184,
  },
  {
    id: "bc-housing",
    name: "BC Housing – Housing Registry",
    category: "housing",
    phone: "604-433-2218",
    address: "1701-4555 Kingsway",
    city: "Burnaby",
    hours: "Mon-Fri 8:30am-4:30pm",
    languages: ["English", "French"],
    description: "Social housing applications, rent subsidies, and emergency housing referrals.",
    latitude: 49.2283, longitude: -123.0040,
  },
  {
    id: "tenant-resource",
    name: "Tenant Resource & Advisory Centre",
    category: "housing",
    phone: "604-255-0546",
    address: "306-1262 Burrard St",
    city: "Vancouver",
    hours: "Mon-Fri 1pm-5pm",
    languages: ["English"],
    description: "Free legal information for BC tenants. Help with evictions, repairs, and deposits.",
    latitude: 49.2749, longitude: -123.1289,
  },

  // ── Safety / Emergency ──
  {
    id: "womens-shelter",
    name: "Vancouver Rape Relief & Women's Shelter",
    category: "safety",
    phone: "604-872-8212",
    address: "Confidential Location",
    city: "Vancouver",
    hours: "24/7 Crisis Line",
    languages: ["English", "French"],
    description: "Emergency safe shelter for women fleeing violence. 24-hour crisis line.",
    latitude: 49.2499, longitude: -123.1140,
  },
  {
    id: "safe-shelter",
    name: "VictimLink BC",
    category: "safety",
    phone: "1-800-563-0808",
    address: "Province-wide Service",
    city: "Province-wide",
    hours: "24/7",
    languages: ["English", "130+ via interpretation"],
    description: "Toll-free, confidential crisis line for all victims of crime including domestic violence.",
    latitude: 49.2827, longitude: -123.1207,
  },
  {
    id: "fire-emergency",
    name: "Vancouver Fire & Rescue Services",
    category: "safety",
    phone: "911",
    address: "900 Heatley Ave",
    city: "Vancouver",
    hours: "24/7 Emergency",
    languages: ["English", "French", "Multilingual dispatch"],
    description: "Fire emergencies, rescue operations, and medical first response. Call 911 for emergencies.",
    latitude: 49.2784, longitude: -123.0806,
  },
  {
    id: "bc-spca-support",
    name: "BC SPCA – Women's Companion Animal Program",
    category: "safety",
    phone: "1-855-622-7722",
    address: "Province-wide Service",
    city: "Province-wide",
    hours: "Mon-Fri 9am-5pm",
    languages: ["English"],
    description: "Temporary foster care for pets of women fleeing domestic violence.",
    latitude: 49.2547, longitude: -123.1173,
  },

  // ── Counselling ──
  {
    id: "ywca-counselling",
    name: "YWCA Counselling Services",
    category: "counselling",
    phone: "604-895-5800",
    address: "535 Hornby St",
    city: "Vancouver",
    hours: "Mon-Fri 8:30am-5pm",
    languages: ["English", "Mandarin", "Cantonese"],
    description: "Individual and group counselling for women and families experiencing trauma.",
    latitude: 49.2842, longitude: -123.1196,
  },
  {
    id: "battered-women",
    name: "Battered Women's Support Services",
    category: "counselling",
    phone: "604-687-1867",
    address: "PO Box 1098",
    city: "Vancouver",
    hours: "24/7 Crisis Line",
    languages: ["English", "Spanish", "Mandarin", "Cantonese", "Punjabi", "Hindi", "Farsi"],
    description: "Crisis support, counselling, and outreach for women experiencing violence.",
    latitude: 49.2607, longitude: -123.1135,
  },
  {
    id: "family-services-gc",
    name: "Family Services of Greater Vancouver",
    category: "counselling",
    phone: "604-874-2938",
    address: "1616 W 7th Ave",
    city: "Vancouver",
    hours: "Mon-Fri 8:30am-4:30pm",
    languages: ["English", "Mandarin", "Cantonese", "Vietnamese", "Spanish"],
    description: "Sliding-scale counselling, support groups, and family mediation services.",
    latitude: 49.2637, longitude: -123.1400,
  },
  {
    id: "oak-counselling",
    name: "Oak Counselling Society",
    category: "counselling",
    phone: "604-266-5611",
    address: "410-688 W Hastings St",
    city: "Vancouver",
    hours: "Mon-Fri 9am-8pm, Sat 10am-4pm",
    languages: ["English"],
    description: "Affordable counselling for individuals, couples, and families. Sliding scale from $10.",
    latitude: 49.2847, longitude: -123.1134,
  },

  // ── Employment ──
  {
    id: "mosaic-employment",
    name: "MOSAIC Employment Services",
    category: "employment",
    phone: "604-254-9626",
    address: "1720 Grant St",
    city: "Vancouver",
    hours: "Mon-Fri 9am-5pm",
    languages: ["English", "Mandarin", "Arabic", "Farsi", "Spanish", "Korean", "Vietnamese"],
    description: "Employment programs, skills training, and job placement for newcomers and refugees.",
    latitude: 49.2682, longitude: -123.0689,
  },
  {
    id: "success-employment",
    name: "S.U.C.C.E.S.S. Employment Services",
    category: "employment",
    phone: "604-684-1628",
    address: "28 W Pender St",
    city: "Vancouver",
    hours: "Mon-Fri 9am-5pm",
    languages: ["English", "Mandarin", "Cantonese", "Korean", "Vietnamese", "Japanese"],
    description: "Employment support including resume building, interview prep, and job matching.",
    latitude: 49.2808, longitude: -123.1047,
  },
  {
    id: "ywca-employment",
    name: "YWCA Employment Programs",
    category: "employment",
    phone: "604-895-5700",
    address: "535 Hornby St",
    city: "Vancouver",
    hours: "Mon-Fri 9am-5pm",
    languages: ["English", "French"],
    description: "Job readiness workshops, career coaching, and women-focused employment support.",
    latitude: 49.2842, longitude: -123.1196,
  },
  {
    id: "workbc-centre",
    name: "WorkBC Centre – Vancouver",
    category: "employment",
    phone: "604-775-1800",
    address: "123-1155 Robson St",
    city: "Vancouver",
    hours: "Mon-Fri 8:30am-4:30pm",
    languages: ["English", "French", "Mandarin", "Punjabi"],
    description: "Free employment services: job search, training, wage subsidies, and skills assessment.",
    latitude: 49.2819, longitude: -123.1207,
  },
];

export const CATEGORY_STYLES: Record<ResourceCategory, { bg: string; icon: string; text: string; tag: string }> = {
  mental:      { bg: "bg-tertiary-container/30",  icon: "bg-tertiary-container text-tertiary",  text: "text-tertiary",  tag: "bg-tertiary-fixed text-on-tertiary-fixed" },
  food:        { bg: "bg-secondary-container/30", icon: "bg-secondary-container text-secondary", text: "text-secondary", tag: "bg-secondary-fixed text-on-secondary-fixed" },
  housing:     { bg: "bg-primary-container/30",   icon: "bg-primary-container text-primary",   text: "text-primary",   tag: "bg-primary-fixed text-on-primary-fixed" },
  safety:      { bg: "bg-error-container/20",     icon: "bg-error-container/30 text-error",    text: "text-error",     tag: "bg-error-container text-on-error-container" },
  counselling: { bg: "bg-tertiary-container/20",  icon: "bg-tertiary-container text-tertiary",  text: "text-tertiary",  tag: "bg-tertiary-fixed text-on-tertiary-fixed" },
  employment:  { bg: "bg-secondary-container/20", icon: "bg-secondary-container text-secondary", text: "text-secondary", tag: "bg-secondary-fixed text-on-secondary-fixed" },
};
