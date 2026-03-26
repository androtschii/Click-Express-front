import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
}

interface ChatBotProps {
  theme?: "dark" | "light";
}

type Lang = "en" | "ru";

// ── Safe math calculator ──────────────────────────────────────────────────────
// Only allows numbers, operators, parens, spaces — no code injection possible
function safeCalc(expr: string): string | null {
  // Extract math expression from natural language
  const cleaned = expr
    .replace(/[xх×]/gi, "*")           // replace × x with *
    .replace(/[÷:]/g, "/")             // replace ÷ with /
    .replace(/(\d)\s*\^\s*(\d)/g, "($1**$2)") // power
    .replace(/squared/gi, "**2")
    .replace(/cubed/gi, "**3")
    .replace(/[^0-9+\-*/().%\s**]/g, " ") // strip non-math chars
    .trim();

  // Must contain at least a number and an operator
  if (!/\d/.test(cleaned) || !/[+\-*/]/.test(cleaned)) return null;
  // Must not be empty after cleaning
  if (!cleaned.trim()) return null;

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${cleaned})`)() as number;
    if (!isFinite(result)) return "Ошибка: деление на ноль / Division by zero ⚠️";
    // Format result: remove trailing .000...
    const formatted = parseFloat(result.toPrecision(12)).toString();
    return formatted;
  } catch {
    return null;
  }
}

function detectMath(input: string): string | null {
  const lower = input.toLowerCase();
  // Trigger words for math
  const mathTriggers = [
    "calculate", "compute", "calc", "math", "=", "how much is", "what is", "сколько будет",
    "посчитай", "вычисли", "рассчитай", "считай", "+", "-", "*", "/", "×", "÷", "плюс", "минус",
    "умножить", "разделить", "squared", "cubed", "percent", "процент"
  ];
  const hasTrigger = mathTriggers.some(t => lower.includes(t));
  const hasNumbers = /\d/.test(input);
  const hasOperator = /[+\-*/×÷^%]/.test(input) || /плюс|минус|умножить|разделить|times|divided|plus|minus/.test(lower);

  if (!hasNumbers) return null;
  if (!hasTrigger && !hasOperator) return null;

  // Extract expression: replace word operators
  let expr = input
    .replace(/плюс|plus/gi, "+")
    .replace(/минус|minus/gi, "-")
    .replace(/умножить на|умножить|times|multiplied by/gi, "*")
    .replace(/разделить на|разделить|divided by/gi, "/")
    .replace(/процент от|percent of|процент/gi, "/100*")
    .replace(/в квадрате|squared/gi, "**2")
    .replace(/в кубе|cubed/gi, "**3");

  return safeCalc(expr);
}

// ── Knowledge base with weighted keywords ────────────────────────────────────
interface KBEntry {
  keywords: Array<{ word: string; weight: number }>;
  answer: Record<Lang, string>;
}

const KB: Record<string, KBEntry> = {
  greeting: {
    keywords: [
      { word: "привет", weight: 10 }, { word: "здравствуй", weight: 10 }, { word: "добрый день", weight: 10 },
      { word: "добрый вечер", weight: 10 }, { word: "добрый утро", weight: 10 }, { word: "хай", weight: 8 },
      { word: "хэй", weight: 8 }, { word: "hello", weight: 10 }, { word: "hi", weight: 8 },
      { word: "hey", weight: 8 }, { word: "good morning", weight: 10 }, { word: "good evening", weight: 10 },
      { word: "sup", weight: 6 }, { word: "yo", weight: 5 },
    ],
    answer: {
      en: "Hey! 👋 I'm the Click Express virtual assistant. I can:\n• Answer questions about **loads & booking**\n• Tell you about **pricing & routes**\n• Help with **careers & contacts**\n• **Calculate** anything (try: \"2500 * 3.73\")\n\nWhat do you need?",
      ru: "Привет! 👋 Я виртуальный помощник Click Express. Я умею:\n• Отвечать на вопросы о **грузах и бронировании**\n• Рассказывать о **ценах и маршрутах**\n• Помогать с **вакансиями и контактами**\n• **Считать** (попробуй: \"2500 * 3.73\")\n\nЧто вас интересует?",
    },
  },

  about: {
    keywords: [
      { word: "о компании", weight: 10 }, { word: "компания", weight: 6 }, { word: "кто вы", weight: 10 },
      { word: "что такое", weight: 8 }, { word: "расскажи о", weight: 10 }, { word: "click express", weight: 10 },
      { word: "about", weight: 8 }, { word: "who are you", weight: 10 }, { word: "tell me about", weight: 9 },
      { word: "what is", weight: 5 }, { word: "company", weight: 6 }, { word: "основана", weight: 7 },
      { word: "founded", weight: 7 }, { word: "история", weight: 7 }, { word: "history", weight: 7 },
    ],
    answer: {
      en: "📦 **Click Express Inc** — USA-based heavy freight carrier founded in **2019**, HQ in Hallandale Beach, FL.\n\n• Covers all **48 continental states**\n• Specializes in flatbed, FTL, LTL, military loads\n• **DOT certified**, FMCSA licensed, fully insured\n• 24/7 dispatch support 🛡️",
      ru: "📦 **Click Express Inc** — американский грузоперевозчик, основан в **2019** году, штаб-квартира в Голландейл-Бич, Флорида.\n\n• Покрывает все **48 штатов** США\n• Специализируется на flatbed, FTL, LTL, военных грузах\n• **DOT сертифицирован**, FMCSA лицензирован, застрахован\n• Диспетчеры 24/7 🛡️",
    },
  },

  loads: {
    keywords: [
      { word: "груз", weight: 8 }, { word: "грузы", weight: 9 }, { word: "перевозка", weight: 8 },
      { word: "доставка", weight: 7 }, { word: "отправление", weight: 7 }, { word: "фрахт", weight: 7 },
      { word: "платформа", weight: 7 }, { word: "flatbed", weight: 9 }, { word: "load", weight: 8 },
      { word: "loads", weight: 9 }, { word: "cargo", weight: 8 }, { word: "freight", weight: 8 },
      { word: "shipment", weight: 7 }, { word: "transport", weight: 6 }, { word: "каталог", weight: 7 },
      { word: "catalog", weight: 7 }, { word: "какие грузы", weight: 10 }, { word: "what loads", weight: 10 },
      { word: "ftl", weight: 9 }, { word: "ltl", weight: 9 }, { word: "full load", weight: 9 },
      { word: "partial", weight: 8 },
    ],
    answer: {
      en: "🚛 Currently available load types:\n\n• **Flatbed** — steel, machinery, oversized equipment\n• **Full Load (FTL)** — dedicated truck, any cargo\n• **Partial Load (LTL)** — shared space, lower cost\n• **Military Load** — certified specialized transport\n\nOpen **Catalog** → filter by city, state, or load type. Each card shows price, $/mile, and ETA.",
      ru: "🚛 Доступные типы грузов:\n\n• **Flatbed (платформа)** — металл, техника, негабарит\n• **Full Load (FTL)** — отдельный грузовик\n• **Partial Load (LTL)** — совместная загрузка, дешевле\n• **Military Load** — специализированная перевозка\n\nОткройте **Каталог** → фильтрация по городу, штату или типу. На каждой карточке: цена, $/миля, время в пути.",
    },
  },

  booking: {
    keywords: [
      { word: "забронировать", weight: 10 }, { word: "бронь", weight: 10 }, { word: "заказать", weight: 9 },
      { word: "заказ", weight: 8 }, { word: "оформить", weight: 9 }, { word: "как записаться", weight: 10 },
      { word: "как заказать", weight: 10 }, { word: "book", weight: 9 }, { word: "booking", weight: 10 },
      { word: "reserve", weight: 9 }, { word: "how to order", weight: 10 }, { word: "how to book", weight: 10 },
      { word: "request a load", weight: 10 }, { word: "sign up", weight: 6 }, { word: "register", weight: 6 },
      { word: "account", weight: 5 }, { word: "аккаунт", weight: 5 }, { word: "регистрация", weight: 6 },
    ],
    answer: {
      en: "📋 **How to book a load:**\n\n1. **Sign in** or create an account (top-right)\n2. Open **Catalog** and pick your load\n3. Click **Book Load** on the detail page\n4. Our dispatcher contacts you within minutes ✅\n\nTrack all your bookings in the **Requests** panel.",
      ru: "📋 **Как забронировать груз:**\n\n1. **Войдите** или создайте аккаунт (правый верхний угол)\n2. Откройте **Каталог** и выберите груз\n3. Нажмите **Book Load** на странице груза\n4. Диспетчер свяжется в течение нескольких минут ✅\n\nВсе заявки отслеживайте в панели **Requests**.",
    },
  },

  price: {
    keywords: [
      { word: "цена", weight: 9 }, { word: "стоимость", weight: 9 }, { word: "сколько стоит", weight: 10 },
      { word: "тариф", weight: 8 }, { word: "за милю", weight: 9 }, { word: "rpm", weight: 9 },
      { word: "прайс", weight: 8 }, { word: "price", weight: 9 }, { word: "cost", weight: 8 },
      { word: "rate", weight: 8 }, { word: "how much", weight: 10 }, { word: "per mile", weight: 9 },
      { word: "fee", weight: 7 }, { word: "charge", weight: 7 }, { word: "оплата", weight: 7 },
      { word: "расценки", weight: 9 }, { word: "pricing", weight: 9 },
    ],
    answer: {
      en: "💰 **Pricing factors:**\n• Route distance (miles)\n• Cargo type & weight\n• Equipment needed\n• Fuel surcharge\n\nEvery catalog card shows **total $** and **$/mile rate**. Typical rates: $2.50–$4.50/mile.\n\nNeed a custom quote? → click **GET A FREE QUOTE** in the header!",
      ru: "💰 **Из чего складывается цена:**\n• Расстояние маршрута (мили)\n• Тип и вес груза\n• Необходимое оборудование\n• Топливная надбавка\n\nКаждая карточка каталога показывает **полную стоимость** и **ставку $/миля**. Типичные ставки: $2.50–$4.50/миля.\n\nНужен расчёт? → нажмите **GET A FREE QUOTE** в шапке!",
    },
  },

  contact: {
    keywords: [
      { word: "контакт", weight: 9 }, { word: "телефон", weight: 10 }, { word: "позвонить", weight: 10 },
      { word: "почта", weight: 9 }, { word: "email", weight: 9 }, { word: "адрес", weight: 8 },
      { word: "связаться", weight: 10 }, { word: "написать", weight: 8 }, { word: "contact", weight: 9 },
      { word: "phone", weight: 10 }, { word: "call", weight: 9 }, { word: "reach", weight: 8 },
      { word: "address", weight: 8 }, { word: "location", weight: 7 }, { word: "instagram", weight: 7 },
      { word: "linkedin", weight: 7 }, { word: "facebook", weight: 7 }, { word: "social", weight: 6 },
      { word: "number", weight: 7 }, { word: "номер", weight: 8 },
    ],
    answer: {
      en: "📞 **Contact Click Express:**\n\n• 📱 **Phone:** +1 786-202-6599\n• 📧 **Email:** clickexpress.inc@gmail.com\n• 📍 **Address:** Hallandale Beach, FL 33009\n• 💼 **LinkedIn:** Click Express Inc\n• 📸 **Instagram:** @clickexpress.official\n\n⏰ Available **24/7** — dispatcher always ready!",
      ru: "📞 **Контакты Click Express:**\n\n• 📱 **Телефон:** +1 786-202-6599\n• 📧 **Email:** clickexpress.inc@gmail.com\n• 📍 **Адрес:** Hallandale Beach, FL 33009\n• 💼 **LinkedIn:** Click Express Inc\n• 📸 **Instagram:** @clickexpress.official\n\n⏰ Работаем **24/7** — диспетчер всегда на связи!",
    },
  },

  dispatch: {
    keywords: [
      { word: "диспетчер", weight: 10 }, { word: "водитель", weight: 8 }, { word: "грузовик", weight: 7 },
      { word: "перевозчик", weight: 7 }, { word: "dispatcher", weight: 10 }, { word: "driver", weight: 8 },
      { word: "truck", weight: 7 }, { word: "carrier", weight: 7 }, { word: "tracking", weight: 8 },
      { word: "отслеживание", weight: 8 }, { word: "gps", weight: 9 }, { word: "где груз", weight: 10 },
      { word: "where is my", weight: 10 }, { word: "real time", weight: 8 }, { word: "в реальном", weight: 8 },
    ],
    answer: {
      en: "🚚 **Dispatch & Tracking:**\n\nOur dispatchers work **24/7**. After booking:\n• You get contacted within minutes\n• Route is planned & permits arranged\n• **GPS tracking** on every shipment\n• Real-time status updates\n\nCall us directly: **+1 786-202-6599**",
      ru: "🚚 **Диспетчеризация и отслеживание:**\n\nДиспетчеры работают **24/7**. После бронирования:\n• Вам позвонят в течение нескольких минут\n• Маршрут спланирован, разрешения получены\n• **GPS-отслеживание** каждой отправки\n• Обновления статуса в реальном времени\n\nПозвоните напрямую: **+1 786-202-6599**",
    },
  },

  careers: {
    keywords: [
      { word: "вакансия", weight: 10 }, { word: "вакансии", weight: 10 }, { word: "работа", weight: 8 },
      { word: "устроиться", weight: 9 }, { word: "трудоустройство", weight: 10 }, { word: "подать заявку", weight: 10 },
      { word: "career", weight: 10 }, { word: "job", weight: 9 }, { word: "work", weight: 6 },
      { word: "hiring", weight: 10 }, { word: "vacancy", weight: 10 }, { word: "apply", weight: 9 },
      { word: "position", weight: 8 }, { word: "cdl", weight: 9 }, { word: "должность", weight: 8 },
      { word: "зарплата", weight: 7 }, { word: "salary", weight: 7 }, { word: "driver job", weight: 10 },
    ],
    answer: {
      en: "💼 **Open Positions at Click Express:**\n\n• 🚛 CDL-A Truck Driver\n• 📡 Freight Dispatcher\n• 📊 Logistics Coordinator\n\nCompetitive pay + benefits. Go to **Careers** page (top menu) to see details and apply!\n\nQuestions? Email: clickexpress.inc@gmail.com",
      ru: "💼 **Открытые вакансии Click Express:**\n\n• 🚛 CDL-A Водитель дальних рейсов\n• 📡 Диспетчер грузоперевозок\n• 📊 Логистик-координатор\n\nКонкурентная зарплата + льготы. Перейдите в раздел **Careers** (верхнее меню) — там детали и форма заявки!\n\nВопросы? Email: clickexpress.inc@gmail.com",
    },
  },

  states: {
    keywords: [
      { word: "штат", weight: 7 }, { word: "штаты", weight: 8 }, { word: "куда везёте", weight: 10 },
      { word: "маршрут", weight: 7 }, { word: "покрытие", weight: 8 }, { word: "регион", weight: 7 },
      { word: "территория", weight: 7 }, { word: "states", weight: 8 }, { word: "where", weight: 5 },
      { word: "where do you", weight: 9 }, { word: "coverage", weight: 9 }, { word: "routes", weight: 8 },
      { word: "continent", weight: 7 }, { word: "nationwide", weight: 9 }, { word: "вся америка", weight: 10 },
      { word: "по всей", weight: 8 }, { word: "все штаты", weight: 10 },
    ],
    answer: {
      en: "🗺️ **Coverage: All 48 continental US states**\n\nPopular routes:\n• 🌅 East Coast ↔ West Coast\n• 🌽 Midwest distribution hubs\n• 🌴 Southeast & Florida lanes\n• 🏔️ Mountain West corridors\n\nSearch by city or state in the **Catalog**!",
      ru: "🗺️ **Покрытие: все 48 штатов континентальной части США**\n\nПопулярные маршруты:\n• 🌅 Восточное ↔ Западное побережье\n• 🌽 Дистрибуция Среднего Запада\n• 🌴 Юго-восток и Флорида\n• 🏔️ Горный Запад\n\nИщите по городу или штату в **Каталоге**!",
    },
  },

  military: {
    keywords: [
      { word: "военный", weight: 10 }, { word: "военные", weight: 10 }, { word: "армия", weight: 9 },
      { word: "военная перевозка", weight: 10 }, { word: "military", weight: 10 }, { word: "army", weight: 9 },
      { word: "defense", weight: 8 }, { word: "government", weight: 7 }, { word: "government cargo", weight: 9 },
      { word: "спецтехника", weight: 9 }, { word: "military load", weight: 10 },
    ],
    answer: {
      en: "🎖️ **Military Load Transport:**\n\nYes! We're certified for military cargo:\n• Armored vehicles & military equipment\n• Government shipments\n• Sensitive/special permit cargo\n\nFilter **Military Load** in the Catalog. All drivers are vetted, all loads fully insured.",
      ru: "🎖️ **Перевозка военных грузов:**\n\nДа! Мы сертифицированы для военных грузов:\n• Бронетехника и военное оборудование\n• Государственные грузы\n• Специальные разрешения\n\nФильтр **Military Load** в Каталоге. Все водители проверены, все грузы застрахованы.",
    },
  },

  insurance: {
    keywords: [
      { word: "страховка", weight: 10 }, { word: "застрахован", weight: 10 }, { word: "безопасность", weight: 8 },
      { word: "ответственность", weight: 8 }, { word: "повреждение", weight: 9 }, { word: "сертификат", weight: 7 },
      { word: "dot", weight: 9 }, { word: "fmcsa", weight: 9 }, { word: "insurance", weight: 10 },
      { word: "insured", weight: 10 }, { word: "safe", weight: 6 }, { word: "damage", weight: 9 },
      { word: "liability", weight: 9 }, { word: "certified", weight: 7 }, { word: "гарантия", weight: 8 },
      { word: "guarantee", weight: 8 },
    ],
    answer: {
      en: "🛡️ **Safety & Compliance:**\n\n• **Fully insured** cargo liability\n• **DOT certified** operations\n• **FMCSA licensed** carrier\n• GPS tracking every mile\n• Background-checked drivers\n\nYour freight is protected from pickup to delivery.",
      ru: "🛡️ **Безопасность и соответствие стандартам:**\n\n• **Полная страховка** ответственности за груз\n• **DOT сертификация**\n• **FMCSA лицензия**\n• GPS-отслеживание каждой мили\n• Проверенные водители\n\nВаш груз защищён от погрузки до доставки.",
    },
  },

  quote: {
    keywords: [
      { word: "расчёт", weight: 10 }, { word: "рассчитать", weight: 10 }, { word: "квота", weight: 9 },
      { word: "оценка", weight: 8 }, { word: "смета", weight: 8 }, { word: "предложение", weight: 7 },
      { word: "quote", weight: 10 }, { word: "estimate", weight: 9 }, { word: "get a quote", weight: 10 },
      { word: "free quote", weight: 10 }, { word: "calculate price", weight: 10 }, { word: "custom rate", weight: 9 },
    ],
    answer: {
      en: "📊 **Get a Free Quote:**\n\nClick **GET A FREE QUOTE** in the header! Fill in:\n• Origin & destination\n• Cargo type & weight\n• Dimensions\n\nResponse within **1 business hour** ✅ No obligation, 100% free.",
      ru: "📊 **Получить бесплатный расчёт:**\n\nНажмите **GET A FREE QUOTE** в шапке сайта! Укажите:\n• Откуда и куда\n• Тип и вес груза\n• Габариты\n\nОтвет в течение **1 рабочего часа** ✅ Бесплатно, без обязательств.",
    },
  },

  payment: {
    keywords: [
      { word: "оплата", weight: 9 }, { word: "предоплата", weight: 10 }, { word: "депозит", weight: 9 },
      { word: "карта", weight: 8 }, { word: "баланс", weight: 8 }, { word: "пополнить", weight: 9 },
      { word: "payment", weight: 9 }, { word: "pay", weight: 7 }, { word: "prepay", weight: 10 },
      { word: "deposit", weight: 9 }, { word: "card", weight: 7 }, { word: "balance", weight: 8 },
      { word: "visa", weight: 8 }, { word: "mastercard", weight: 8 }, { word: "credit", weight: 7 },
    ],
    answer: {
      en: "💳 **Payment Options:**\n\nPrepayment via **Profile → Payment tab:**\n• Visa, MasterCard, AmEx accepted\n• Balance added instantly\n• 10–25% prepayment typical for booking\n\nFor custom payment terms, contact us: **+1 786-202-6599**",
      ru: "💳 **Варианты оплаты:**\n\nПредоплата через **Профиль → вкладка Оплата:**\n• Visa, MasterCard, AmEx\n• Баланс пополняется мгновенно\n• Типичная предоплата: 10–25% от стоимости\n\nПо индивидуальным условиям: **+1 786-202-6599**",
    },
  },

  math_help: {
    keywords: [
      { word: "посчитай", weight: 10 }, { word: "вычисли", weight: 10 }, { word: "рассчитай", weight: 9 },
      { word: "сколько будет", weight: 10 }, { word: "calculate", weight: 10 }, { word: "compute", weight: 10 },
      { word: "what is", weight: 3 }, { word: "how much is", weight: 8 }, { word: "math", weight: 10 },
      { word: "считать", weight: 9 }, { word: "умеешь считать", weight: 10 }, { word: "можешь посчитать", weight: 10 },
    ],
    answer: {
      en: "🧮 **Yes, I can calculate!** Just type:\n• `1500 * 2.92` → multiply\n• `4100 / 1778` → divide ($/mi)\n• `2500 + 1800` → add\n• `5120 * 0.1` → 10% prepayment\n• `(120 + 80) * 3.5` → with brackets\n\nTry it!",
      ru: "🧮 **Да, я умею считать!** Просто напишите:\n• `1500 * 2.92` → умножение\n• `4100 / 1778` → деление ($/миля)\n• `2500 + 1800` → сложение\n• `5120 * 0.1` → 10% предоплата\n• `(120 + 80) * 3.5` → со скобками\n\nПопробуйте!",
    },
  },

  thanks: {
    keywords: [
      { word: "спасибо", weight: 10 }, { word: "благодарю", weight: 10 }, { word: "thanks", weight: 10 },
      { word: "thank you", weight: 10 }, { word: "great", weight: 5 }, { word: "awesome", weight: 5 },
      { word: "perfect", weight: 5 }, { word: "отлично", weight: 5 }, { word: "хорошо", weight: 4 },
      { word: "👍", weight: 8 }, { word: "супер", weight: 6 }, { word: "классно", weight: 6 },
    ],
    answer: {
      en: "You're welcome! 😊 Anything else I can help you with?",
      ru: "Пожалуйста! 😊 Могу ещё чем-нибудь помочь?",
    },
  },

  bye: {
    keywords: [
      { word: "пока", weight: 10 }, { word: "до свидания", weight: 10 }, { word: "до встречи", weight: 9 },
      { word: "всего", weight: 5 }, { word: "bye", weight: 10 }, { word: "goodbye", weight: 10 },
      { word: "see you", weight: 9 }, { word: "later", weight: 5 }, { word: "cya", weight: 9 },
    ],
    answer: {
      en: "Goodbye! 👋 Have a great day and good hauling! 🚛",
      ru: "До свидания! 👋 Хорошего дня и удачных рейсов! 🚛",
    },
  },
};

// ── Score-based matching ──────────────────────────────────────────────────────
function getBotAnswer(input: string, lang: Lang): string {
  const lower = input.toLowerCase();

  // 1. Check for math first
  const mathResult = detectMath(input);
  if (mathResult !== null) {
    const expr = input.replace(/посчитай|вычисли|рассчитай|сколько будет|calculate|compute|what is|how much is/gi, "").trim();
    return lang === "ru"
      ? `🧮 **Результат:** ${expr.trim() ? `\`${expr.trim()}\` = ` : ""}**${mathResult}**`
      : `🧮 **Result:** ${expr.trim() ? `\`${expr.trim()}\` = ` : ""}**${mathResult}**`;
  }

  // 2. Score each KB topic
  let bestKey = "";
  let bestScore = 0;

  for (const [key, entry] of Object.entries(KB)) {
    let score = 0;
    for (const { word, weight } of entry.keywords) {
      if (lower.includes(word.toLowerCase())) {
        score += weight;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  // 3. Minimum score threshold (avoid garbage matches)
  if (bestScore >= 5 && bestKey) {
    return KB[bestKey].answer[lang];
  }

  // 4. Fallback
  return lang === "ru"
    ? "Не совсем понял 🤔 Попробуй переформулировать.\n\nЯ умею отвечать на вопросы о:\n• Грузах и бронировании\n• Ценах и маршрутах\n• Вакансиях и контактах\n• **Математических расчётах** (например: `2500 * 3.73`)\n\nИли звони: **+1 786-202-6599**"
    : "Not sure I understood 🤔 Try rephrasing.\n\nI can answer about:\n• Loads & booking\n• Pricing & routes\n• Careers & contacts\n• **Math calculations** (e.g. `2500 * 3.73`)\n\nOr call: **+1 786-202-6599**";
}

const QUICK_EN = ["What loads do you have?", "How to book?", "Pricing info", "Calculate 2500 * 3.73", "Contact details"];
const QUICK_RU = ["Какие грузы есть?", "Как забронировать?", "Стоимость перевозки", "Посчитай 2500 * 3.73", "Контакты"];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MsgText({ text, isDark }: { text: string; isDark: boolean }) {
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, i) => {
        // Handle bold (**text**) and inline code (`text`)
        const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j} style={{ color: isDark ? "#ff8888" : "#CC0000" }}>{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith("`") && part.endsWith("`")) {
                return <code key={j} style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", borderRadius: 3, padding: "1px 5px", fontFamily: "monospace", fontSize: 12 }}>{part.slice(1, -1)}</code>;
              }
              return <span key={j}>{part}</span>;
            })}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export const ChatBot: React.FC<ChatBotProps> = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pulse, setPulse] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgId = useRef(0);

  const bg = isDark ? "#0d0d0d" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const botBubble = isDark ? "#1a1a1a" : "#f0f0f0";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const mutedColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";
  const inputBg = isDark ? "#141414" : "#f8f8f8";

  useEffect(() => { const t = setTimeout(() => setPulse(false), 8000); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: ++msgId.current, from: "bot", time: now(),
        text: lang === "ru"
          ? "Привет! 👋 Я помощник **Click Express**.\n\nМогу отвечать на вопросы о грузах, ценах, бронировании, вакансиях — и умею **считать** 🧮\n\nЧто вас интересует?"
          : "Hey! 👋 I'm the **Click Express** assistant.\n\nI can answer about loads, pricing, booking, careers — and I can **calculate** 🧮\n\nWhat do you need?",
      }]);
    }
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 200); }
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: ++msgId.current, from: "user", text: text.trim(), time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const answer = getBotAnswer(text, lang as Lang);
      setMessages(prev => [...prev, { id: ++msgId.current, from: "bot", text: answer, time: now() }]);
      setTyping(false);
      if (!open) setUnread(n => n + 1);
    }, 600 + Math.random() * 500);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const quickReplies = lang === "ru" ? QUICK_RU : QUICK_EN;

  return (
    <>
      <style>{`
        @keyframes chatPulse { 0%,100%{box-shadow:0 0 0 0 rgba(204,0,0,0.5)}50%{box-shadow:0 0 0 16px rgba(204,0,0,0)} }
        @keyframes chatUp { from{opacity:0;transform:translateY(18px) scale(0.96)}to{opacity:1;transform:none} }
        @keyframes dot { 0%,80%,100%{transform:scale(0.55);opacity:0.35}40%{transform:scale(1);opacity:1} }
        .chat-quick:hover{background:rgba(204,0,0,0.12)!important;border-color:#CC0000!important;color:#CC0000!important}
        .chat-input:focus{outline:none;border-color:#CC0000!important;box-shadow:0 0 0 2px rgba(204,0,0,0.15)}
        .chat-send-btn:hover:not(:disabled){background:#aa0000!important;transform:scale(1.05)}
      `}</style>

      {/* Floating button */}
      <div style={{ position:"fixed", bottom:28, right:28, zIndex:3000 }}>
        <button onClick={() => setOpen(o => !o)}
          style={{ width:58, height:58, borderRadius:"50%", background:"linear-gradient(135deg,#CC0000,#ff3333)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 32px rgba(204,0,0,0.5)", animation: pulse && !open ? "chatPulse 2s infinite" : "none", transition:"transform 0.2s", position:"relative" }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}>
          {open
            ? <svg width="22" height="22" viewBox="0 0 256 256" fill="#fff"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>
            : <svg width="26" height="26" viewBox="0 0 256 256" fill="#fff"><path d="M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM216,192H80a8,8,0,0,0-5.23,1.95L40,224V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,144Z"/></svg>
          }
          {!open && unread > 0 && (
            <div style={{ position:"absolute", top:-4, right:-4, width:20, height:20, borderRadius:"50%", background:"#ff4444", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow',sans-serif", fontWeight:900, fontSize:10, color:"#fff" }}>
              {unread}
            </div>
          )}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div style={{ position:"fixed", bottom:100, right:28, zIndex:2999, width:"clamp(300px,90vw,390px)", borderRadius:18, overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(204,0,0,0.2)", animation:"chatUp 0.3s ease", display:"flex", flexDirection:"column", maxHeight:"72vh" }}>

          {/* Header */}
          <div style={{ background: isDark ? "#1a0000" : "#CC0000", padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:18 }}>🚛</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:15, color:"#fff" }}>Click Express Bot</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80" }} />
                <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"rgba(255,255,255,0.8)" }}>
                  {lang === "ru" ? "Онлайн • отвечает мгновенно" : "Online • instant replies"}
                </span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%", width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 256 256" fill="#fff"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", background:bg, padding:"16px 14px", display:"flex", flexDirection:"column", gap:10, overscrollBehavior:"contain" }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display:"flex", flexDirection:"column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", animation:"chatUp 0.2s ease" }}>
                <div style={{ maxWidth:"86%", padding:"10px 14px", borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.from === "user" ? "#CC0000" : botBubble, color: msg.from === "user" ? "#fff" : textColor, fontFamily:"'Barlow',sans-serif", fontSize:13.5, lineHeight:1.6 }}>
                  <MsgText text={msg.text} isDark={isDark} />
                </div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:mutedColor, marginTop:3, padding:"0 4px" }}>{msg.time}</div>
              </div>
            ))}
            {typing && (
              <div style={{ display:"flex", alignItems:"flex-start", animation:"chatUp 0.2s ease" }}>
                <div style={{ padding:"12px 16px", borderRadius:"16px 16px 16px 4px", background:botBubble, display:"flex", gap:5, alignItems:"center" }}>
                  {[0, 0.18, 0.36].map((d, i) => (
                    <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#CC0000", animation:`dot 1.1s ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies — shown initially */}
          {messages.length <= 1 && !typing && (
            <div style={{ background:bg, borderTop:`1px solid ${border}`, padding:"10px 14px", display:"flex", gap:7, flexWrap:"wrap" }}>
              {quickReplies.map(q => (
                <button key={q} className="chat-quick" onClick={() => sendMessage(q)}
                  style={{ padding:"6px 11px", background:"transparent", border:`1px solid ${border}`, borderRadius:20, fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:11, color:mutedColor, cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div style={{ background:bg, borderTop:`1px solid ${border}`, padding:"12px 14px", display:"flex", gap:10, alignItems:"center" }}>
            <input ref={inputRef} className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder={lang === "ru" ? "Вопрос или выражение: 1500*3.5..." : "Question or expression: 1500*3.5..."}
              style={{ flex:1, padding:"10px 14px", background:inputBg, border:`1px solid ${border}`, borderRadius:10, color:textColor, fontFamily:"'Barlow',sans-serif", fontSize:13, transition:"border-color 0.2s, box-shadow 0.2s" }} />
            <button className="chat-send-btn" onClick={() => sendMessage(input)} disabled={!input.trim()}
              style={{ width:40, height:40, borderRadius:"50%", background: input.trim() ? "#CC0000" : (isDark?"#222":"#e0e0e0"), border:"none", cursor: input.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
              <svg width="18" height="18" viewBox="0 0 256 256" fill={input.trim()?"#fff":(isDark?"#444":"#aaa")}>
                <path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
