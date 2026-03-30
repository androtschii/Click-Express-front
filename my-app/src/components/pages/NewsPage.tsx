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
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? "#eab308" : "rgba(0,0,0,0.15)", fontSize: 12 }}>★</span>
      ))}
    </span>
  );
}

export const NewsPage: React.FC<NewsPageProps> = ({ theme = "dark", onBack, onViewLoads, onLoadDetail }) => {
  const { lang } = useLanguage();
  const [activecat, setActivecat] = useState<Category>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const isDark = theme === "dark";

  const bg         = isDark ? "#080808" : "#f5f5f5";
  const cardBg     = isDark ? "#0f0f0f" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const textPrimary  = isDark ? "#ffffff"             : "#1a1a1a";
  const textMuted    = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const textSubtle   = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)";
  const divider      = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  const filtered = activecat === "all" ? ARTICLES : ARTICLES.filter(a => a.category === activecat);
  const featured = filtered.find(a => a.featured) || filtered[0];
  const rest = filtered.filter(a => a.id !== featured?.id);

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textPrimary }}>
      <style>{`
        @keyframes newsSlideUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes newsHeroPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes newsBadgePop  { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
        @keyframes newsGlow      { 0%,100%{box-shadow:0 0 18px rgba(204,0,0,0.3)} 50%{box-shadow:0 0 40px rgba(204,0,0,0.65)} }
        .news-card:hover { transform:translateY(-5px) !important; border-color:#CC0000 !important; box-shadow:0 18px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(204,0,0,0.25) !important; }
        .news-card { transition: all 0.22s ease !important; }
        .cat-tab:hover { background: rgba(204,0,0,0.12) !important; color: #CC0000 !important; }
      `}</style>

      {/* ── ARTICLE DETAIL PAGE ── */}
      {(() => {
        if (selectedId === null) return null;
        const article = ARTICLES.find(a => a.id === selectedId);
        if (!article) return null;
        const catLabel = lang === "ru" ? CATS.find(c => c.key === article.category)?.ru : CATS.find(c => c.key === article.category)?.en;
        return (
          <div style={{ minHeight: "100vh", background: bg, padding: "90px clamp(20px,5vw,64px) 60px", animation: "newsSlideUp 0.4s ease both" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <button onClick={() => { setSelectedId(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 1, cursor: "pointer", padding: "0 0 24px", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#CC0000"; }}
                onMouseLeave={e => { e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"; }}>
                ← {lang === "ru" ? "Все новости" : "All news"}
              </button>

              {/* Category tag + date */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ background: `${article.accentColor}18`, color: article.accentColor, border: `1px solid ${article.accentColor}40`, padding: "4px 12px", borderRadius: 3, fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
                  {article.icon} {catLabel}
                </span>
                <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: textSubtle }}>{article.date}</span>
                <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: textSubtle }}>{article.readTime} {lang === "ru" ? "мин" : "min"}</span>
              </div>

              {/* Highlight (loads) */}
              {article.category === "loads" && article.highlightEn && (
                <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 36, color: "#CC0000", lineHeight: 1, marginBottom: 14 }}>
                  {lang === "ru" ? article.highlightRu : article.highlightEn}
                </div>
              )}

              {/* Author (reviews) */}
              {article.category === "reviews" && article.authorInitial && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", flexShrink: 0 }}>
                    {article.authorInitial}
                  </div>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 16, color: textPrimary }}>{article.author}</span>
                </div>
              )}

              {/* Title */}
              <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(22px,4vw,36px)", color: textPrimary, textTransform: article.category === "reviews" ? "none" : "uppercase", lineHeight: 1.2, marginBottom: 24 }}>
                {lang === "ru" ? article.titleRu : article.titleEn}
              </h1>

              <div style={{ width: 60, height: 4, background: article.accentColor, borderRadius: 2, marginBottom: 28 }} />

              {/* Body text */}
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 16, color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)", lineHeight: 1.85, marginBottom: 28, whiteSpace: "pre-line" }}>
                {lang === "ru" ? article.excerptRu : article.excerptEn}
              </p>

              {/* Driver stops */}
              {article.stops && article.stops.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#a855f7", marginBottom: 14 }}>
                    {lang === "ru" ? "ОСТАНОВКИ" : "STOPS"}
                  </div>
                  {article.stops.map((stop, si) => (
                    <div key={si} style={{ background: isDark ? "rgba(168,85,247,0.07)" : "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.18)", borderRadius: 8, padding: "12px 16px", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: textPrimary }}>{stop.name}</span>
                        <StarRating n={stop.rating} />
                      </div>
                      <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: textSubtle }}>{lang === "ru" ? stop.noteRu : stop.noteEn}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA for loads */}
              {article.category === "loads" && (
                <button onClick={() => { setSelectedId(null); onViewLoads?.(); }}
                  style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 10, background: "#CC0000", color: "#fff", border: "none", borderRadius: 6, padding: "14px 32px", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 20px rgba(204,0,0,0.4)", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#aa0000"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#CC0000"; e.currentTarget.style.transform = "none"; }}>
                  {lang === "ru" ? "СМОТРЕТЬ ГРУЗЫ →" : "VIEW LOADS →"}
                </button>
              )}
            </div>
          </div>
        );
      })()}
      {selectedId !== null ? null : <>

      {/* ── HERO BANNER ── */}
      <div style={{ position: "relative", background: isDark ? "#080000" : "#f0ecec", padding: "90px clamp(20px,5vw,64px) 56px", overflow: "hidden" }}>
        {/* Background photo */}
        <img src="/images/real7.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: isDark ? "brightness(0.18) saturate(0.7)" : "brightness(0.55) saturate(0.5)", pointerEvents: "none" }} />
        {/* Dark gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(105deg,rgba(10,0,0,0.92) 0%,rgba(20,0,0,0.75) 50%,rgba(10,0,0,0.88) 100%)" : "linear-gradient(105deg,rgba(255,240,240,0.88) 0%,rgba(240,220,220,0.72) 100%)", pointerEvents: "none" }} />
        {/* BG grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg,${isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.025)"} 0px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,${isDark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.025)"} 0px,transparent 1px,transparent 60px)`, pointerEvents: "none" }} />
        {/* Red left line */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#CC0000" }} />
        {/* Top glow */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#CC0000 30%,#ff3333 60%,#CC0000 80%,transparent)" }} />

        <div style={{ maxWidth: 900, animation: "newsSlideUp 0.6s ease both" }}>
          {/* Back button */}
          <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 1, cursor: "pointer", padding: "0 0 20px", transition: "color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"; }}>
            ← {lang === "ru" ? "Назад" : "Back"}
          </button>
          {/* Live badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.35)", borderRadius: 20, padding: "5px 14px", marginBottom: 24, animation: "newsBadgePop 0.5s ease 0.1s both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#CC0000", animation: "newsHeroPulse 1.4s ease infinite", display: "inline-block" }} />
            <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase" }}>
              {lang === "ru" ? "Актуально сейчас" : "Live Updates"}
            </span>
          </div>

          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(42px,7vw,88px)", textTransform: "uppercase", lineHeight: 0.9, margin: "0 0 16px", color: textPrimary }}>
            {lang === "ru" ? (
              <><span style={{ color: "#CC0000" }}>CLICK EXPRESS</span><br />НОВОСТИ</>
            ) : (
              <><span style={{ color: "#CC0000" }}>CLICK EXPRESS</span><br />NEWS HUB</>
            )}
          </h1>

          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 16, color: textMuted, maxWidth: 520, lineHeight: 1.75, margin: 0 }}>
            {lang === "ru"
              ? "Лучшие лоты, отзывы водителей, новости компании, безопасность на дорогах и стоянки для дальнобойщиков — всё в одном месте."
              : "Best loads of the week, driver reviews, company updates, road safety and truck stop guides — all in one place."}
          </p>
        </div>

        {/* Big decorative truck emoji */}
        <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", fontSize: 160, opacity: isDark ? 0.05 : 0.06, userSelect: "none", pointerEvents: "none" }}>🚛</div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: isDark ? "rgba(8,0,0,0.95)" : "rgba(245,245,245,0.97)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${divider}`, boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px,4vw,56px)", display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none" }}>
          {CATS.map(c => {
            const isActive = activecat === c.key;
            return (
              <button key={c.key} className="cat-tab" onClick={() => setActivecat(c.key)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "14px 16px", border: "none", background: isActive ? "#CC0000" : "transparent", color: isActive ? "#fff" : textMuted, fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, borderRadius: 0, borderBottom: isActive ? "3px solid #ff3333" : "3px solid transparent", transition: "all 0.15s" }}>
                <span style={{ fontSize: 14 }}>{c.icon}</span>
                {lang === "ru" ? c.ru : c.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "44px clamp(20px,4vw,56px) 80px" }}>

        {/* ── FEATURED CARD ── */}
        {featured && (
          <div style={{ background: featured.category === "loads" ? `linear-gradient(135deg, #1a0000 0%, #2d0000 50%, #1a0000 100%)` : cardBg, border: `1px solid ${featured.accentColor}40`, borderRadius: 14, padding: "40px 44px", marginBottom: 44, position: "relative", overflow: "hidden", animation: "newsSlideUp 0.5s ease both", cursor: "pointer", boxShadow: `0 8px 48px ${featured.accentColor}20` }}
            onClick={() => { if (featured.load && onLoadDetail) { onLoadDetail(featured.load); } else { setSelectedId(featured.id); window.scrollTo({ top: 0, behavior: "smooth" }); } }}>
            {/* Accent line top */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${featured.accentColor}, ${featured.accentColor}80, transparent)` }} />
            <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", fontSize: 140, opacity: 0.05, pointerEvents: "none" }}>{featured.icon}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ background: featured.accentColor, color: "#fff", padding: "4px 12px", borderRadius: 3, fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
                ★ {lang === "ru" ? "ИЗБРАННОЕ" : "FEATURED"}
              </span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: featured.accentColor, letterSpacing: 1 }}>{featured.date}</span>
            </div>

            {featured.highlightEn && (
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", color: featured.accentColor, lineHeight: 1, marginBottom: 12 }}>
                {lang === "ru" ? featured.highlightRu : featured.highlightEn}
              </div>
            )}

            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(22px,3vw,34px)", color: featured.category === "loads" ? "#fff" : textPrimary, textTransform: "uppercase", lineHeight: 1.15, marginBottom: 16, maxWidth: 680 }}>
              {lang === "ru" ? featured.titleRu : featured.titleEn}
            </h2>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: featured.category === "loads" ? "rgba(255,255,255,0.65)" : textMuted, lineHeight: 1.75, maxWidth: 580 }}>
              {lang === "ru" ? featured.excerptRu : featured.excerptEn}
            </p>
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 12, color: featured.accentColor, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
                {lang === "ru" ? "ЧИТАТЬ ДАЛЕЕ →" : "READ MORE →"}
              </span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: featured.category === "loads" ? "rgba(255,255,255,0.35)" : textSubtle }}>
                {featured.readTime} {lang === "ru" ? "чтения" : "read"}
              </span>
            </div>
          </div>
        )}

        {/* ── NEWS GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 22 }}>
          {rest.map((article, idx) => (
            <div key={article.id} className="news-card"
              onClick={() => { if (article.load && onLoadDetail) { onLoadDetail(article.load); } else { setSelectedId(article.id); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", animation: `newsSlideUp 0.4s ease ${idx * 0.04}s both` }}>

              {/* Colored top bar */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${article.accentColor}, ${article.accentColor}60)` }} />

              <div style={{ padding: "22px 24px 20px" }}>
                {/* Tag + date row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ background: `${article.accentColor}18`, color: article.accentColor, border: `1px solid ${article.accentColor}40`, padding: "3px 10px", borderRadius: 3, fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>
                    {article.icon} {lang === "ru" ? CATS.find(c => c.key === article.category)?.ru : CATS.find(c => c.key === article.category)?.en}
                  </span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: textSubtle }}>{article.date}</span>
                </div>

                {/* Review author circle */}
                {article.category === "reviews" && article.authorInitial && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", flexShrink: 0 }}>
                      {article.authorInitial}
                    </div>
                    <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: textPrimary }}>{article.author}</span>
                  </div>
                )}

                {/* Load highlight */}
                {article.category === "loads" && article.highlightEn && (
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: "#CC0000", lineHeight: 1, marginBottom: 8 }}>
                    {lang === "ru" ? article.highlightRu : article.highlightEn}
                  </div>
                )}

                {/* Title */}
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: article.category === "reviews" ? 15 : 18, color: textPrimary, textTransform: article.category === "reviews" ? "none" : "uppercase", lineHeight: 1.2, marginBottom: 10 }}>
                  {lang === "ru" ? article.titleRu : article.titleEn}
                </h3>

                {/* Quote icon for reviews */}
                {article.category === "reviews" && (
                  <div style={{ fontSize: 32, color: `${article.accentColor}30`, fontFamily: "Georgia,serif", lineHeight: 0.5, marginBottom: 6 }}>"</div>
                )}

                {/* Excerpt */}
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: textMuted, lineHeight: 1.7, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  {lang === "ru" ? article.excerptRu : article.excerptEn}
                </p>

                {/* Driver Stops list */}
                {article.stops && article.stops.slice(0, 2).map((stop, si) => (
                  <div key={si} style={{ background: isDark ? "rgba(168,85,247,0.07)" : "rgba(168,85,247,0.05)", border: `1px solid rgba(168,85,247,0.18)`, borderRadius: 6, padding: "8px 12px", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: textPrimary }}>{stop.name}</span>
                      <StarRating n={stop.rating} />
                    </div>
                    <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: textSubtle }}>{lang === "ru" ? stop.noteRu : stop.noteEn}</span>
                  </div>
                ))}
                {article.stops && article.stops.length > 2 && (
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: "#a855f7", marginBottom: 8 }}>
                    +{article.stops.length - 2} {lang === "ru" ? "ещё остановок" : "more stops"}
                  </div>
                )}

                {/* Footer */}
                <div style={{ borderTop: `1px solid ${divider}`, paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: article.accentColor, letterSpacing: 1.5, textTransform: "uppercase" }}>
                    {lang === "ru" ? "ЧИТАТЬ →" : "READ MORE →"}
                  </span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: textSubtle }}>
                    {article.readTime} {lang === "ru" ? "мин" : "min"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{ marginTop: 60, background: "linear-gradient(135deg,#CC0000,#880000)", borderRadius: 14, padding: "44px 48px", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: "3%", top: "50%", transform: "translateY(-50%)", fontSize: 100, opacity: 0.07, pointerEvents: "none" }}>🚛</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
              {lang === "ru" ? "ГОТОВ К РАБОТЕ?" : "READY TO ROLL?"}
            </div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(26px,4vw,42px)", color: "#fff", textTransform: "uppercase", lineHeight: 1, marginBottom: 14 }}>
              {lang === "ru" ? "НАЙДИ СВОЙ СЛЕДУЮЩИЙ ГРУЗ" : "FIND YOUR NEXT LOAD"}
            </h3>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 28 }}>
              {lang === "ru" ? "Свяжись с диспетчером прямо сейчас — 24/7" : "Contact our dispatcher right now — available 24/7"}
            </p>
            <a href="tel:+17862026599" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "#CC0000", borderRadius: 6, padding: "14px 32px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", boxShadow: "0 6px 24px rgba(0,0,0,0.3)", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,0.3)"; }}>
              📞 +1 786-202-6599
            </a>
          </div>
        </div>

      </div>
    </>}
    </div>
  );
};
