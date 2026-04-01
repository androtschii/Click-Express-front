import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { Load } from "../../types/index";

interface NewsPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
  onViewLoads?: () => void;
  onLoadDetail?: (load: Load) => void;
}

type Category = "all" | "loads" | "company" | "freight" | "safety" | "drivers";

interface Article {
  id: number;
  category: Exclude<Category, "all">;
  titleEn: string;
  titleRu: string;
  excerptEn: string;
  excerptRu: string;
  date: string;
  readTime: string;
  icon: string;
  accentColor: string;
  featured?: boolean;
  highlightEn?: string;
  highlightRu?: string;
  stops?: { name: string; rating: number; noteEn: string; noteRu: string }[];
  author?: string;
  authorInitial?: string;
  load?: Load;
}

const CAT_COLOR: Record<Exclude<Category, "all">, string> = {
  loads:   "#CC0000",
  company: "#3b82f6",
  freight: "#f97316",
  safety:  "#eab308",
  drivers: "#a855f7",
};

const ARTICLES: Article[] = [
  /* ─── BEST LOADS ─── */
  {
    id: 1, category: "loads", featured: true,
    accentColor: "#CC0000",
    icon: "🏆",
    titleEn: "Monster Load of the Week: $8,400 — Connellsville, PA → Denver, CO",
    titleRu: "Лот недели: $8,400 — Коннелсвилл, PA → Денвер, CO",
    excerptEn: "1,780 miles of pure flatbed glory. Oversized steel structure, escort required. Rate: $4.72/mi — one of the best of 2025.",
    excerptRu: "1,780 миль на платформе. Негабаритная стальная конструкция, требует сопровождения. Ставка: $4.72/ми — один из лучших лотов 2025.",
    highlightEn: "$8,400 / 1,780 mi", highlightRu: "$8,400 / 1,780 ми",
    date: "Mar 24, 2025", readTime: "2 min",
    load: { id: 101, route: "Connellsville, PA", dest: "Denver, CO", price: 8400, miles: 1780, type: "Full Load", cargo: "Flatbed / Oversized Steel Structure", image: "/images/real7.jpg", tag: "Best Load of the Week" },
  },
  {
    id: 2, category: "loads",
    accentColor: "#CC0000", icon: "🚛",
    titleEn: "Top Flatbed Run: $5,120 — Madera, CA → Fort Collins, CO",
    titleRu: "Топ платформа: $5,120 — Мадера, CA → Форт Коллинс, CO",
    excerptEn: "HVAC units, 1,374 miles, $3.73/mi. Clean load, no tarping. Booked within 2 hours of posting.",
    excerptRu: "HVAC блоки, 1,374 мили, $3.73/ми. Чистый груз, без тарпинга. Забронировано за 2 часа после публикации.",
    highlightEn: "$5,120 / 1,374 mi", highlightRu: "$5,120 / 1,374 ми",
    date: "Mar 21, 2025", readTime: "2 min",
    load: { id: 102, route: "Madera, CA", dest: "Fort Collins, CO", price: 5120, miles: 1374, type: "Full Load", cargo: "Flatbed / HVAC Units", image: "/images/real2.jpg", tag: "Best Load of the Week" },
  },
  {
    id: 3, category: "loads",
    accentColor: "#CC0000", icon: "🛡️",
    titleEn: "Military Equipment Move: $6,800 — Deer Park, WA → Jackson, WY",
    titleRu: "Военный груз: $6,800 — Дир Парк, WA → Джексон, WY",
    excerptEn: "DOD-certified load. Special permits secured. 720 miles, $9.44/mi — premium rate for a premium operation.",
    excerptRu: "Сертифицированный груз DOD. Специальные разрешения оформлены. 720 миль, $9.44/ми — премиальная ставка.",
    highlightEn: "$6,800 / 720 mi", highlightRu: "$6,800 / 720 ми",
    date: "Mar 18, 2025", readTime: "3 min",
    load: { id: 103, route: "Deer Park, WA", dest: "Jackson, WY", price: 6800, miles: 720, type: "Full Load", cargo: "Flatbed / Military Equipment DOD", image: "/images/real3.jpg", tag: "Military Load" },
  },
  {
    id: 4, category: "loads",
    accentColor: "#CC0000", icon: "⭐",
    titleEn: "Florida Run Winner: $4,000 — Key Largo, FL → Lake Ozark, MO",
    titleRu: "Флоридский победитель: $4,000 — Ки Ларго, FL → Лейк Озарк, MO",
    excerptEn: "Equipment on a 1,447 mi run through the South. $2.76/mi with no issues. Driver completed in under 28h.",
    excerptRu: "Техника на маршруте 1,447 миль через юг. $2.76/ми, без проблем. Водитель выполнил за 28ч.",
    highlightEn: "$4,000 / 1,447 mi", highlightRu: "$4,000 / 1,447 ми",
    date: "Mar 15, 2025", readTime: "2 min",
    load: { id: 104, route: "Key Largo, FL", dest: "Lake Ozark, MO", price: 4000, miles: 1447, type: "Full Load", cargo: "Flatbed / Equipment", image: "/images/real5.jpg", tag: "Best Load of the Week" },
  },

  {
    id: 5, category: "loads",
    accentColor: "#CC0000", icon: "🏗️",
    titleEn: "Cross-Country Flatbed: $6,350 — Las Vegas, NV → Carnesville, GA",
    titleRu: "Трансконтинентальная платформа: $6,350 — Лас-Вегас, NV → Карнесвилл, GA",
    excerptEn: "2,047 miles coast to coast. Construction equipment on flatbed — full + partial combo load. $3.10/mi rate on one of the longest east-to-west runs of the season.",
    excerptRu: "2,047 миль от побережья до побережья. Строительная техника на платформе — комбо полная+частичная загрузка. Ставка $3.10/ми на одном из самых длинных маршрутов сезона.",
    highlightEn: "$6,350 / 2,047 mi", highlightRu: "$6,350 / 2,047 ми",
    date: "Mar 28, 2025", readTime: "3 min",
    stops: [
      { name: "Kingman, AZ — I-40 East", rating: 5, noteEn: "First fuel stop after NV border, Love's with 24h service", noteRu: "Первая заправка после границы Невады, Love's, круглосуточно" },
      { name: "Albuquerque, NM — I-40 / I-25", rating: 4, noteEn: "Major junction, Pilot Flying J, wide truck lot", noteRu: "Крупная развязка, Pilot Flying J, большая парковка" },
      { name: "Oklahoma City, OK — I-40 / I-35", rating: 5, noteEn: "Midpoint rest, TA Petro, full restaurant & showers", noteRu: "Середина маршрута, TA Petro, ресторан и душевые" },
      { name: "Memphis, TN — I-40 / I-55", rating: 4, noteEn: "Last major stop before GA, Flying J, laundry & fuel", noteRu: "Последняя крупная остановка перед Джорджией, Flying J, прачечная" },
    ],
    load: { id: 105, route: "Las Vegas, NV", dest: "Carnesville, GA", price: 6350, miles: 2047, type: "Partial", cargo: "Flatbed / Construction Equipment", image: "/images/real8.jpg", tag: "Best Load of the Week" },
  },

  /* ─── COMPANY NEWS ─── */
  {
    id: 8, category: "company",
    accentColor: "#3b82f6", icon: "🏆",
    titleEn: "Click Express Hits 500+ Delivered Loads Milestone",
    titleRu: "Click Express достиг 500+ доставленных грузов",
    excerptEn: "March 2025 — We crossed the 500 successfully delivered loads mark. Every load, every driver, every mile counts. Thank you to our team and all the operators who trust us.",
    excerptRu: "Март 2025 — Мы пересекли отметку в 500 успешно доставленных грузов. Каждый груз, каждый водитель, каждая миля важны. Спасибо команде и всем операторам.",
    date: "Mar 25, 2025", readTime: "3 min",
  },
  {
    id: 9, category: "company",
    accentColor: "#3b82f6", icon: "👥",
    titleEn: "New Dispatcher Joins — 24/7 Coverage Expanded",
    titleRu: "Новый диспетчер — расширяем покрытие 24/7",
    excerptEn: "We've welcomed a new team member to our dispatch team. This means faster response times, more load options, and even more reliable around-the-clock service for all our drivers.",
    excerptRu: "Мы приветствуем нового члена команды. Это означает более быстрое время ответа, больше лотов и ещё более надёжный круглосуточный сервис для всех наших водителей.",
    date: "Mar 12, 2025", readTime: "2 min",
  },
  {
    id: 10, category: "company",
    accentColor: "#3b82f6", icon: "🗺️",
    titleEn: "Click Express Now Covers All 48 Contiguous States",
    titleRu: "Click Express теперь работает во всех 48 штатах",
    excerptEn: "From Florida to Washington, from Maine to California — we've officially expanded our network to cover every contiguous US state. No route is too far.",
    excerptRu: "От Флориды до Вашингтона, от Мэна до Калифорнии — мы официально расширили сеть на все 48 штатов США. Нет слишком далёкого маршрута.",
    date: "Feb 28, 2025", readTime: "2 min",
  },
  {
    id: 11, category: "company",
    accentColor: "#3b82f6", icon: "🎬",
    titleEn: "Company Recap Video 2025 — Best Loads & Best Moments",
    titleRu: "Рекап видео компании 2025 — лучшие лоты и моменты",
    excerptEn: "We released our annual highlights reel. From oversized equipment moves to military contracts, from coast-to-coast flatbeds to our growing team — this is Click Express.",
    excerptRu: "Мы выпустили ежегодное видео с лучшими моментами. От негабаритных грузов до военных контрактов, от побережья до побережья — это Click Express.",
    date: "Feb 15, 2025", readTime: "2 min",
  },

  /* ─── FREIGHT INDUSTRY ─── */
  {
    id: 12, category: "freight",
    accentColor: "#f97316", icon: "📦",
    titleEn: "Why Flatbed Freight is Booming in 2025",
    titleRu: "Почему рынок платформ бурно растёт в 2025",
    excerptEn: "Oversized cargo demand has surged 34% year-over-year. Infrastructure projects, industrial equipment, and energy sector growth are driving the biggest flatbed boom in a decade.",
    excerptRu: "Спрос на негабаритные грузы вырос на 34% год к году. Инфраструктурные проекты, промышленное оборудование и рост энергетического сектора движут крупнейшим бумом платформ за десятилетие.",
    date: "Mar 22, 2025", readTime: "4 min",
  },
  {
    id: 13, category: "freight",
    accentColor: "#f97316", icon: "📡",
    titleEn: "How Dispatch Services Changed the Owner-Operator Game",
    titleRu: "Как диспетчерские сервисы изменили игру для owner-операторов",
    excerptEn: "Solo owner-operators used to spend 4–6 hours a day searching for loads. Modern dispatch services cut that to zero — and negotiate better rates than most drivers can alone.",
    excerptRu: "Независимые перевозчики раньше тратили 4–6 часов в день на поиск грузов. Современные диспетчерские сервисы сократили это до нуля — и договариваются о лучших ставках.",
    date: "Mar 16, 2025", readTime: "5 min",
  },
  {
    id: 14, category: "freight",
    accentColor: "#f97316", icon: "💰",
    titleEn: "Rate Per Mile Guide: What's a Good Deal in 2025?",
    titleRu: "Гид по ставке на милю: что считается хорошей сделкой в 2025?",
    excerptEn: "Flatbed average: $2.80–$3.40/mi. Oversized: $4.00–$6.00/mi. Military: $6.00–$10.00+/mi. Here's how to spot a great load and when to walk away.",
    excerptRu: "Средняя по платформам: $2.80–$3.40/ми. Негабаритные: $4.00–$6.00/ми. Военные: $6.00–$10.00+/ми. Как распознать отличный лот и когда отказываться.",
    date: "Mar 8, 2025", readTime: "5 min",
  },

  /* ─── ROAD SAFETY ─── */
  {
    id: 15, category: "safety",
    accentColor: "#eab308", icon: "⚠️",
    titleEn: "I-40 Through New Mexico: Hazards, Weather & Speed Traps",
    titleRu: "I-40 через Нью-Мексико: опасности, погода и ловушки",
    excerptEn: "I-40 between Albuquerque and Tucumcari is one of the most accident-prone truck corridors in the country. Wind gusts above 60mph, unmarked crosswinds, and aggressive enforcement zones.",
    excerptRu: "I-40 между Альбукерке и Тукумкари — один из самых аварийных коридоров для грузовиков в США. Порывы ветра выше 60 миль/ч, боковые ветры и зоны активных штрафов.",
    date: "Mar 19, 2025", readTime: "6 min",
  },
  {
    id: 16, category: "safety",
    accentColor: "#eab308", icon: "🚨",
    titleEn: "Top 10 Most Dangerous Highways for Freight Trucks in the USA",
    titleRu: "Топ-10 самых опасных трасс для грузовиков в США",
    excerptEn: "I-4 in Florida, I-10 through Arizona, US-1 in Maine, I-70 in Colorado mountains — these routes claim the most truck accident fatalities every year. Know before you go.",
    excerptRu: "I-4 во Флориде, I-10 через Аризону, US-1 в Мэне, I-70 в горах Колорадо — эти маршруты лидируют по числу смертельных ДТП с грузовиками каждый год. Знай перед выездом.",
    date: "Mar 11, 2025", readTime: "7 min",
  },
  {
    id: 17, category: "safety",
    accentColor: "#eab308", icon: "💥",
    titleEn: "Blowout at Highway Speed: Driver Survival Guide",
    titleRu: "Взрыв покрышки на скорости: гид по выживанию",
    excerptEn: "Don't hit the brakes. Grip the wheel, maintain speed briefly, then gradually decelerate. Most rollover deaths happen because drivers panic and brake hard. Here's what the pros do.",
    excerptRu: "Не жмите на тормоз. Держите руль, кратко сохраняйте скорость, затем плавно снижайте. Большинство смертей при опрокидывании — паника и резкое торможение. Вот что делают профессионалы.",
    date: "Mar 5, 2025", readTime: "4 min",
  },

  /* ─── DRIVER STOPS ─── */
  {
    id: 18, category: "drivers",
    accentColor: "#a855f7", icon: "🛣️",
    titleEn: "I-95 Corridor (FL → NY): Best Truck Stops",
    titleRu: "Коридор I-95 (FL → NY): лучшие остановки для грузовиков",
    excerptEn: "The busiest freight highway on the East Coast. Here are the highest-rated truck stops with parking, showers, food, and diesel by state.",
    excerptRu: "Самая загруженная грузовая трасса Восточного побережья. Лучшие грузовые стоянки с парковкой, душем, едой и дизелем по штатам.",
    stops: [
      { name: "Love's #504 — Savannah, GA", rating: 5, noteEn: "120 parking spots, Hardee's, clean showers", noteRu: "120 мест, Hardee's, чистые душевые" },
      { name: "Pilot #386 — Rocky Mount, NC", rating: 4, noteEn: "Subway inside, 24h scale, 80 spaces", noteRu: "Subway, весы 24ч, 80 мест" },
      { name: "TA Petro — Florence, SC", rating: 5, noteEn: "Full restaurant, Iron Skillet, truck wash", noteRu: "Полноценный ресторан, мойка грузовиков" },
      { name: "Flying J — Lumberton, NC", rating: 4, noteEn: "Large lot, Denny's, laundry", noteRu: "Большая парковка, Denny's, прачечная" },
    ],
    date: "Mar 23, 2025", readTime: "5 min",
  },
  {
    id: 19, category: "drivers",
    accentColor: "#a855f7", icon: "🌵",
    titleEn: "I-10 West Run (FL → CA): Shower, Food & Parking Guide",
    titleRu: "I-10 Запад (FL → CA): душ, еда и парковка для дальнобойщиков",
    excerptEn: "2,400 miles of desert, mountains, and sun. The transcontinental trucker's bible — best stops in Alabama, Mississippi, Texas, New Mexico, Arizona, and California.",
    excerptRu: "2,400 миль через пустыни, горы и солнце. Библия дальнобойщика-трансконтинентала — лучшие остановки в Алабаме, Миссисипи, Техасе, Нью-Мексико, Аризоне и Калифорнии.",
    stops: [
      { name: "Petro Stopping Center — El Paso, TX", rating: 5, noteEn: "Massive lot, Iron Skillet 24h, showers always clean", noteRu: "Огромная парковка, ресторан 24ч, чистые душевые" },
      { name: "Love's — Deming, NM", rating: 4, noteEn: "Desert oasis, Chester's Chicken, fast diesel lanes", noteRu: "Оазис в пустыне, Chester's Chicken, быстрые линии дизеля" },
      { name: "TA — Quartzsite, AZ", rating: 4, noteEn: "120+ spots, BurgerKing, WiFi", noteRu: "120+ мест, BurgerKing, WiFi" },
      { name: "Pilot — Banning, CA", rating: 5, noteEn: "Gateway to LA, good showers, 24h scales", noteRu: "Ворота в Лос-Анджелес, хорошие душевые, весы 24ч" },
    ],
    date: "Mar 17, 2025", readTime: "5 min",
  },
  {
    id: 20, category: "drivers",
    accentColor: "#a855f7", icon: "🎸",
    titleEn: "Route 40: Memphis to Los Angeles — Best Rest Stops",
    titleRu: "Трасса 40: Мемфис → Лос-Анджелес — лучшие стоянки",
    excerptEn: "1,800 miles of American highway history. Route 40 passes through Tennessee, Arkansas, Oklahoma, Texas, New Mexico, Arizona — here's where to eat, sleep, and fuel.",
    excerptRu: "1,800 миль истории американских дорог. Трасса 40 проходит через Теннесси, Арканзас, Оклахому, Техас, Нью-Мексико, Аризону — где поесть, поспать и заправиться.",
    stops: [
      { name: "Flying J — West Memphis, AR", rating: 5, noteEn: "Great on-ramp access, 24h Denny's, laundry", noteRu: "Удобный съезд, Denny's 24ч, прачечная" },
      { name: "Love's — Amarillo, TX", rating: 4, noteEn: "Texas-sized lot, Arby's, truck wash available", noteRu: "Огромная парковка по-техасски, Arby's, мойка" },
      { name: "TA Petro — Tucumcari, NM", rating: 5, noteEn: "Historic stop, full service, Iron Skillet", noteRu: "Историческая остановка, полный сервис, Iron Skillet" },
    ],
    date: "Mar 9, 2025", readTime: "4 min",
  },
  {
    id: 21, category: "drivers",
    accentColor: "#a855f7", icon: "⭐",
    titleEn: "Texas Triangle: Houston–Dallas–San Antonio Overnight Spots",
    titleRu: "Техасский Треугольник: Хьюстон–Даллас–Сан-Антонио — ночёвки",
    excerptEn: "One of the busiest freight triangles in the country. Overnight parking is tight — here are the reliable spots that always have space, hot food, and security.",
    excerptRu: "Один из самых загруженных грузовых треугольников в стране. Ночная парковка плотная — вот надёжные места, где всегда есть место, горячая еда и безопасность.",
    stops: [
      { name: "Pilot — Waco, TX (I-35)", rating: 5, noteEn: "Central triangle hub, always spots available, Subway", noteRu: "Центральный узел треугольника, Subway, всегда есть места" },
      { name: "Love's — Ennis, TX", rating: 4, noteEn: "Secure lot, Chester's Chicken, fast lanes", noteRu: "Охраняемая парковка, Chester's Chicken, быстрые линии" },
      { name: "TA — San Marcos, TX", rating: 5, noteEn: "Between Austin & San Antonio, great food court", noteRu: "Между Остином и Сан-Антонио, отличный фуд-корт" },
    ],
    date: "Mar 3, 2025", readTime: "4 min",
  },
];

const CATS: { key: Category; en: string; ru: string; icon: string }[] = [
  { key: "all",     en: "All News",       ru: "Все новости",       icon: "📰" },
  { key: "loads",   en: "Best Loads",     ru: "Лучшие лоты",       icon: "🏆" },
  { key: "company", en: "Company",        ru: "Компания",          icon: "🏢" },
  { key: "freight", en: "Industry",       ru: "Индустрия",         icon: "📦" },
  { key: "safety",  en: "Road Safety",    ru: "Безопасность",      icon: "⚠️" },
  { key: "drivers", en: "Driver Stops",   ru: "Стоянки",           icon: "🛣️" },
];

function StarRating({ n }: { n: number }) {
  return (
    <span style={{ letterSpacing: -1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? "#FFB800" : "rgba(128,128,128,0.3)", fontSize: 11 }}>★</span>
      ))}
    </span>
  );
}

export const NewsPage: React.FC<NewsPageProps> = ({ theme = "dark", onBack, onViewLoads, onLoadDetail }) => {
  const { lang } = useLanguage();
  const [activecat, setActivecat] = useState<Category>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const isDark = theme === "dark";

  const bg           = isDark ? "#0a0a0a" : "#f4f0e8";
  const surface      = isDark ? "#141414" : "#ffffff";
  const textPrimary  = isDark ? "#f0ede8" : "#0d0d0d";
  const textMuted    = isDark ? "rgba(240,237,232,0.5)"  : "rgba(13,13,13,0.5)";
  const textSubtle   = isDark ? "rgba(240,237,232,0.28)" : "rgba(13,13,13,0.3)";
  const border       = isDark ? "rgba(240,237,232,0.08)" : "rgba(13,13,13,0.1)";
  const borderStrong = isDark ? "rgba(240,237,232,0.18)" : "rgba(13,13,13,0.2)";

  const filtered = activecat === "all" ? ARTICLES : ARTICLES.filter(a => a.category === activecat);
  const featured = filtered.find(a => a.featured) || filtered[0];
  const rest     = filtered.filter(a => a.id !== featured?.id);

  const tickerItems = ARTICLES
    .filter(a => a.category === "loads" && a.highlightEn && a.load)
    .map(a => `${a.icon} ${lang === "ru" ? a.highlightRu : a.highlightEn} — ${a.load!.route} → ${a.load!.dest}`);

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .ncard { transition: all 0.2s cubic-bezier(0.22,1,0.36,1) !important; cursor:pointer; }
        .ncard:hover { transform:translateY(-4px) !important; box-shadow:0 20px 60px rgba(0,0,0,0.28) !important; }
        .catbtn { transition: all 0.15s ease !important; position: relative; }
        .catbtn::after { content:''; position:absolute; bottom:0; left:50%; right:50%; height:3px; background:currentColor; opacity:0; transition: left 0.18s ease, right 0.18s ease, opacity 0.18s ease; }
        .catbtn:hover::after { left:12%; right:12%; opacity:0.45; }
        .catbtn:hover { background: rgba(204,0,0,0.07) !important; text-shadow: 0 0 18px rgba(204,0,0,0.55); }
        .backbtn { transition: color 0.15s !important; }
        .backbtn:hover { color:#CC0000 !important; }
        .ctabtn { transition: all 0.18s ease !important; }
        .ctabtn:hover { transform:translateY(-2px) !important; box-shadow:0 12px 40px rgba(0,0,0,0.45) !important; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-thumb { background:#CC0000; border-radius:2px; }
      `}</style>

      {/* ── DETAIL VIEW ── */}
      {selectedId !== null && (() => {
        const article = ARTICLES.find(a => a.id === selectedId);
        if (!article) return null;
        const catInfo = CATS.find(c => c.key === article.category);
        const ratePerMile = article.load ? (article.load.price / article.load.miles).toFixed(2) : null;
        const stopAccent = article.category === "loads" ? "#CC0000" : "#a855f7";
        return (
          <div style={{ minHeight: "100vh", background: bg, animation: "fadeIn 0.3s ease both" }}>
            <div style={{ background: article.accentColor, padding: "6px 0", overflow: "hidden" }}>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.65)", textAlign: "center", textTransform: "uppercase" }}>
                {article.icon} {lang === "ru" ? catInfo?.ru : catInfo?.en} &nbsp;·&nbsp; {article.date} &nbsp;·&nbsp; {article.readTime} {lang === "ru" ? "МИН" : "MIN"} &nbsp;·&nbsp; CLICK EXPRESS
              </div>
            </div>
            <div style={{ maxWidth: 740, margin: "0 auto", padding: "48px clamp(20px,5vw,48px) 80px", animation: "slideUp 0.4s ease both" }}>
              <button className="backbtn" onClick={() => { setSelectedId(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ background: "transparent", border: "none", color: textMuted, fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 3, cursor: "pointer", padding: "0 0 36px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                ← {lang === "ru" ? "ВСЕ НОВОСТИ" : "ALL NEWS"}
              </button>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${article.accentColor}15`, border: `1px solid ${article.accentColor}35`, borderLeft: `3px solid ${article.accentColor}`, padding: "5px 14px 5px 12px", marginBottom: 28 }}>
                <span style={{ fontSize: 14 }}>{article.icon}</span>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 3, color: article.accentColor, textTransform: "uppercase" }}>{lang === "ru" ? catInfo?.ru : catInfo?.en}</span>
              </div>
              {article.category === "loads" && article.highlightEn && (
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(56px,10vw,88px)", color: "#CC0000", lineHeight: 0.85, letterSpacing: -1, marginBottom: 8 }}>
                  {lang === "ru" ? article.highlightRu : article.highlightEn}
                </div>
              )}
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(26px,5vw,44px)", color: textPrimary, textTransform: "uppercase", lineHeight: 1.2, letterSpacing: 0.5, marginBottom: 24, marginTop: article.category === "loads" ? 14 : 0 }}>
                {lang === "ru" ? article.titleRu : article.titleEn}
              </h1>
              <div style={{ height: 2, background: `linear-gradient(90deg, ${article.accentColor}, transparent)`, marginBottom: 32 }} />
              {article.load && (
                <div style={{ background: surface, border: `1px solid ${border}`, borderLeft: "4px solid #CC0000", padding: "18px 24px", marginBottom: 32 }}>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 8, letterSpacing: 4, color: textSubtle, textTransform: "uppercase", marginBottom: 10 }}>FREIGHT TICKET — CLICK EXPRESS INC</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 17, color: textPrimary }}>{article.load.route}</span>
                        <span style={{ color: "#CC0000", fontSize: 15 }}>→</span>
                        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 17, color: textPrimary }}>{article.load.dest}</span>
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: textMuted }}>
                        {article.load.cargo} · {article.load.miles.toLocaleString()} {lang === "ru" ? "миль" : "mi"}
                        {ratePerMile && <span> · <span style={{ color: "#00b450", fontWeight: 700 }}>${ratePerMile}/mi</span></span>}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 30, color: "#CC0000", lineHeight: 1 }}>${article.load.price.toLocaleString()}</div>
                  </div>
                </div>
              )}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: isDark ? "rgba(240,237,232,0.75)" : "rgba(13,13,13,0.72)", lineHeight: 1.9, marginBottom: 36, letterSpacing: 0.1 }}>
                {lang === "ru" ? article.excerptRu : article.excerptEn}
              </p>
              {article.stops && article.stops.length > 0 && (
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: stopAccent, marginBottom: 20 }}>
                    {article.category === "loads" ? (lang === "ru" ? "МАРШРУТ" : "ROUTE") : (lang === "ru" ? "ОСТАНОВКИ" : "STOPS")}
                  </div>
                  <div style={{ position: "relative", paddingLeft: 32 }}>
                    <div style={{ position: "absolute", left: 9, top: 8, bottom: 8, width: 2, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
                    {article.stops.map((stop, si) => (
                      <div key={si} style={{ position: "relative", marginBottom: si < (article.stops?.length ?? 0) - 1 ? 16 : 0 }}>
                        <div style={{ position: "absolute", left: -29, top: 12, width: 18, height: 18, borderRadius: "50%", background: surface, border: `2px solid ${stopAccent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: stopAccent }} />
                        </div>
                        <div style={{ background: surface, border: `1px solid ${border}`, borderLeft: `3px solid ${stopAccent}`, padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: textPrimary }}>{stop.name}</span>
                            <StarRating n={stop.rating} />
                          </div>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: textMuted }}>{lang === "ru" ? stop.noteRu : stop.noteEn}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {article.category === "loads" && (
                <button className="ctabtn" onClick={() => { setSelectedId(null); onViewLoads?.(); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#CC0000", color: "#fff", border: "none", padding: "16px 36px", fontFamily: "'Anton', sans-serif", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 24px rgba(204,0,0,0.4)" }}>
                  {lang === "ru" ? "СМОТРЕТЬ ВСЕ ГРУЗЫ →" : "VIEW ALL LOADS →"}
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {selectedId === null && <>
        {/* ── TICKER ── */}
        <div style={{ background: "#CC0000", padding: "7px 0", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg,#CC0000,transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(270deg,#CC0000,transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 30s linear infinite" }}>
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.9)", textTransform: "uppercase", paddingRight: 64 }}>{item}</span>
            ))}
          </div>
        </div>

        {/* ── HERO ── */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: "72vh", display: "flex", flexDirection: "column" }}>
          {/* Фото главной фуры */}
          <img
            src={isDark ? "/images/red%20freightliner%20cascadia%202026%20night.png" : "/images/red%20freightliner%20cascadia%202026.PNG"}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%", filter: isDark ? "brightness(0.6) saturate(0.85)" : "brightness(0.9) saturate(0.9)", pointerEvents: "none" }}
          />
          {/* Градиент — тёмный слева, прозрачный справа */}
          <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(100deg,rgba(10,10,10,0.97) 0%,rgba(10,10,10,0.88) 45%,rgba(10,10,10,0.45) 70%,rgba(10,10,10,0.1) 100%)" : "linear-gradient(100deg,rgba(244,240,232,0.97) 0%,rgba(244,240,232,0.88) 45%,rgba(244,240,232,0.4) 70%,rgba(244,240,232,0.05) 100%)", pointerEvents: "none" }} />
          {/* Снизу затемнение */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: isDark ? "linear-gradient(to top,rgba(10,10,10,1),transparent)" : "linear-gradient(to top,rgba(244,240,232,1),transparent)", pointerEvents: "none" }} />
          {/* Точечная сетка */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: isDark ? "radial-gradient(circle,rgba(255,255,255,0.035) 1px,transparent 1px)" : "radial-gradient(circle,rgba(0,0,0,0.05) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
          {/* Красная линия слева */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(to bottom,#CC0000,#880000)" }} />

          <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", padding: "0 clamp(24px,5vw,72px)" }}>
            {/* Top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, paddingBottom: 20, borderBottom: `1px solid ${borderStrong}`, marginBottom: 52 }}>
              <button className="backbtn" onClick={onBack} style={{ background: "transparent", border: "none", color: textMuted, fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 3, cursor: "pointer", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                ← {lang === "ru" ? "НАЗАД" : "BACK"}
              </button>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 3, color: textSubtle, textTransform: "uppercase" }}>US DOT 3159368 · MC 110572 · +1 786-202-6599</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.35)", borderRadius: 20, padding: "5px 14px" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#CC0000", animation: "pulse 1.6s ease infinite" }} />
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 9, letterSpacing: 3, color: "#CC0000", textTransform: "uppercase" }}>{lang === "ru" ? "АКТУАЛЬНО" : "LIVE"}</span>
              </div>
            </div>

            {/* Основной контент — две колонки */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", paddingBottom: 72, animation: "slideUp 0.6s ease both" }}>
              {/* Левая: текст */}
              <div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 9, letterSpacing: 6, color: "#CC0000", textTransform: "uppercase", marginBottom: 18 }}>
                  {lang === "ru" ? "ОФИЦИАЛЬНЫЕ НОВОСТИ КОМПАНИИ" : "OFFICIAL COMPANY DISPATCH"}
                </div>
                <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(52px,7.5vw,104px)", textTransform: "uppercase", lineHeight: 1.05, letterSpacing: -1, color: textPrimary, margin: "0 0 32px" }}>
                  <span style={{ color: "#CC0000" }}>CLICK</span>{" "}EXPRESS<br />
                  <span style={{ color: "#CC0000" }}>{lang === "ru" ? "НОВОСТИ" : "DISPATCH"}</span>
                </h1>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: textMuted, lineHeight: 1.8, maxWidth: 420, margin: "0 0 36px" }}>
                  {lang === "ru" ? "Лучшие лоты, маршруты, новости компании, безопасность дорог и гид по стоянкам." : "Best loads of the week, routes, company news, road safety & the trucker's guide to stops."}
                </p>
                {/* Статы */}
                <div style={{ display: "flex", gap: 36 }}>
                  {[
                    { v: "500+", l: lang === "ru" ? "Грузов" : "Loads" },
                    { v: "48",   l: lang === "ru" ? "Штатов" : "States" },
                    { v: "24/7", l: lang === "ru" ? "Сервис" : "Service" },
                    { v: "6+",   l: lang === "ru" ? "Лет" : "Years" },
                  ].map(({ v, l }, i) => (
                    <div key={v} style={{ position: "relative" }}>
                      {i > 0 && <div style={{ position: "absolute", left: -18, top: "10%", bottom: "10%", width: 1, background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)" }} />}
                      <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(26px,3.5vw,40px)", color: "#CC0000", lineHeight: 1, textShadow: "0 0 20px rgba(204,0,0,0.35)" }}>{v}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: textSubtle, letterSpacing: 2.5, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Правая: пусто — фура видна сквозь градиент */}
              <div />
            </div>
          </div>
        </div>

        {/* ── CATEGORY NAV ── */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: isDark ? "rgba(10,10,10,0.97)" : "rgba(244,240,232,0.97)", backdropFilter: "blur(20px)", borderBottom: `2px solid ${border}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,4vw,56px)", display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
            {CATS.map(c => {
              const isActive = activecat === c.key;
              const accent = c.key === "all" ? "#CC0000" : CAT_COLOR[c.key as Exclude<Category,"all">] ?? "#CC0000";
              return (
                <button key={c.key} className="catbtn" onClick={() => setActivecat(c.key)}
                  style={{ padding: "15px 18px", border: "none", background: "transparent", borderBottom: isActive ? `3px solid ${accent}` : "3px solid transparent", color: isActive ? accent : textMuted, fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13 }}>{c.icon}</span>
                  {lang === "ru" ? c.ru : c.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "44px clamp(20px,4vw,56px) 100px" }}>

          {/* FEATURED */}
          {featured && (
            <div className="ncard" onClick={() => { if (featured.load && onLoadDetail) onLoadDetail(featured.load); else { setSelectedId(featured.id); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
              style={{ display: "grid", gridTemplateColumns: featured.load ? "1fr 1fr" : "1fr", marginBottom: 44, border: `1px solid ${border}`, background: surface, overflow: "hidden", position: "relative", animation: "slideUp 0.5s ease both" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${featured.accentColor},${featured.accentColor}50,transparent)` }} />
              <div style={{ padding: "40px 44px", background: featured.category === "loads" ? (isDark ? "#0e0000" : "#fff8f8") : surface }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#CC0000", color: "#fff", padding: "4px 12px", marginBottom: 22, fontFamily: "'Anton', sans-serif", fontSize: 9, letterSpacing: 4, textTransform: "uppercase" }}>
                  ★ {lang === "ru" ? "ИЗБРАННОЕ" : "FEATURED"}
                </div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 3, color: featured.accentColor, textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{featured.icon}</span>{lang === "ru" ? CATS.find(c => c.key === featured.category)?.ru : CATS.find(c => c.key === featured.category)?.en} · {featured.date}
                </div>
                {featured.highlightEn && (
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(40px,6vw,68px)", color: "#CC0000", lineHeight: 0.88, marginBottom: 14 }}>
                    {lang === "ru" ? featured.highlightRu : featured.highlightEn}
                  </div>
                )}
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: "clamp(20px,2.5vw,30px)", color: textPrimary, textTransform: "uppercase", lineHeight: 1.25, marginBottom: 18, letterSpacing: 0.5 }}>
                  {lang === "ru" ? featured.titleRu : featured.titleEn}
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: textMuted, lineHeight: 1.8, marginBottom: 24, maxWidth: 420 }}>
                  {lang === "ru" ? featured.excerptRu : featured.excerptEn}
                </p>
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 3, color: featured.accentColor, textTransform: "uppercase" }}>
                  {lang === "ru" ? "ЧИТАТЬ →" : "READ MORE →"}
                </span>
              </div>
              {featured.load && (
                <div style={{ padding: "40px 44px", background: isDark ? "linear-gradient(135deg,#180000,#0d0000)" : "linear-gradient(135deg,#fff0f0,#ffe6e6)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -20, bottom: -20, fontSize: 160, opacity: 0.04, pointerEvents: "none", lineHeight: 1 }}>🚛</div>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 8, letterSpacing: 4, color: "rgba(204,0,0,0.5)", textTransform: "uppercase", marginBottom: 18 }}>FREIGHT DETAILS</div>
                  {[
                    { label: lang === "ru" ? "МАРШРУТ" : "ROUTE", value: `${featured.load.route} → ${featured.load.dest}`, big: false },
                    { label: lang === "ru" ? "РАССТОЯНИЕ" : "DISTANCE", value: `${featured.load.miles.toLocaleString()} mi`, big: false },
                    { label: lang === "ru" ? "СТАВКА/МИ" : "RATE/MILE", value: `$${(featured.load.price / featured.load.miles).toFixed(2)}/mi`, big: true },
                    { label: lang === "ru" ? "ТИП" : "CARGO", value: featured.load.cargo, big: false },
                  ].map(({ label, value, big }) => (
                    <div key={label} style={{ marginBottom: 18 }}>
                      <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 8, letterSpacing: 3, color: "rgba(204,0,0,0.55)", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontFamily: big ? "'Anton', sans-serif" : "'DM Sans', sans-serif", fontWeight: big ? undefined : 700, fontSize: big ? 26 : 14, color: big ? "#00b450" : textPrimary, lineHeight: 1.1 }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 20 }}>
            {rest.map((article, idx) => {
              const isLoad = article.category === "loads";
              const ratePerMile = article.load ? (article.load.price / article.load.miles).toFixed(2) : null;
              return (
                <div key={article.id} className="ncard"
                  onClick={() => { if (article.load && onLoadDetail) onLoadDetail(article.load); else { setSelectedId(article.id); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                  style={{ background: isLoad ? (isDark ? "#0e0000" : "#fff8f8") : surface, border: `1px solid ${border}`, borderTop: `3px solid ${article.accentColor}`, overflow: "hidden", position: "relative", animation: `slideUp 0.4s ease ${idx * 0.04}s both` }}>
                  <div style={{ padding: "28px 28px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${article.accentColor}14`, border: `1px solid ${article.accentColor}30`, padding: "4px 12px" }}>
                        <span style={{ fontSize: 12 }}>{article.icon}</span>
                        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 2.5, color: article.accentColor, textTransform: "uppercase" }}>
                          {lang === "ru" ? CATS.find(c => c.key === article.category)?.ru : CATS.find(c => c.key === article.category)?.en}
                        </span>
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: textSubtle }}>{article.date}</span>
                    </div>
                    {isLoad && article.highlightEn && (
                      <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(32px,5vw,44px)", color: "#CC0000", lineHeight: 0.9, marginBottom: 12, letterSpacing: -0.5 }}>
                        {lang === "ru" ? article.highlightRu : article.highlightEn}
                      </div>
                    )}
                    {isLoad && ratePerMile && (
                      <div style={{ display: "inline-flex", alignItems: "center", background: isDark ? "rgba(0,180,80,0.15)" : "rgba(0,180,80,0.1)", border: "1px solid rgba(0,180,80,0.35)", padding: "4px 10px", marginBottom: 14, fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 2, color: "#00b450", textTransform: "uppercase" }}>
                        ${ratePerMile}/MI
                      </div>
                    )}
                    <h3 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 17, color: textPrimary, textTransform: "uppercase", lineHeight: 1.35, letterSpacing: 0.5, marginBottom: 14 }}>
                      {lang === "ru" ? article.titleRu : article.titleEn}
                    </h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: isDark ? "rgba(240,237,232,0.72)" : "rgba(13,13,13,0.65)", lineHeight: 1.85, marginBottom: 18, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                      {lang === "ru" ? article.excerptRu : article.excerptEn}
                    </p>
                    {isLoad && article.load && (
                      <div style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: `1px solid ${isDark ? "rgba(204,0,0,0.25)" : "rgba(204,0,0,0.18)"}`, padding: "10px 14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: textPrimary }}>{article.load.route}</span>
                        <span style={{ color: "#CC0000", fontSize: 14 }}>→</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: textPrimary }}>{article.load.dest}</span>
                      </div>
                    )}
                    {article.stops?.slice(0, 2).map((stop, si) => (
                      <div key={si} style={{ borderLeft: `2px solid ${article.accentColor}60`, padding: "7px 12px", marginBottom: 8, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: textPrimary }}>{stop.name}</span>
                          <StarRating n={stop.rating} />
                        </div>
                      </div>
                    ))}
                    {article.stops && article.stops.length > 2 && (
                      <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 2, color: article.accentColor, textTransform: "uppercase", marginBottom: 12 }}>
                        +{article.stops.length - 2} {lang === "ru" ? "ЕЩЁ" : "MORE"}
                      </div>
                    )}
                    <div style={{ borderTop: `1px solid ${border}`, paddingTop: 14, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 2.5, color: article.accentColor, textTransform: "uppercase" }}>
                        {lang === "ru" ? "ПОДРОБНЕЕ →" : "READ MORE →"}
                      </span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: textSubtle }}>{article.readTime} {lang === "ru" ? "мин" : "min"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 64, background: "#CC0000", padding: "48px clamp(24px,5vw,64px)", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,rgba(0,0,0,0.05) 0px,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 20px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 10 }}>
                {lang === "ru" ? "ГОТОВ К РАБОТЕ?" : "READY TO ROLL?"}
              </div>
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(30px,5vw,52px)", color: "#fff", textTransform: "uppercase", lineHeight: 0.9, letterSpacing: -0.5, marginBottom: 12 }}>
                {lang === "ru" ? "НАЙДИ СВОЙ СЛЕДУЮЩИЙ ГРУЗ" : "FIND YOUR NEXT LOAD"}
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
                {lang === "ru" ? "Свяжись с диспетчером прямо сейчас — 24/7" : "Contact our dispatcher right now — available 24/7"}
              </p>
            </div>
            <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
              <a href="tel:+17862026599" className="ctabtn" style={{ display: "block", background: "#fff", color: "#CC0000", padding: "16px 36px", fontFamily: "'Anton', sans-serif", fontSize: 17, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.25)", whiteSpace: "nowrap", textAlign: "center" }}>
                📞 +1 786-202-6599
              </a>
            </div>
          </div>
        </div>
      </>}
    </div>
  );
};
