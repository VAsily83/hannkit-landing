import React, { useEffect, useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input"; // стили подключены в _app.tsx

// ---- Responsive helper (TS-safe for Vercel) ----
function useMedia(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }
    // Safari legacy
    // @ts-ignore
    mql.addListener(update);
    // @ts-ignore
    return () => mql.removeListener(update);
  }, [query]);
  return matches;
}

type Lang = "ru" | "en" | "zh";

const COLORS = {
  brand: "#0B1E5B",
  brandSoft: "#0b1e5b14",
  text: "#111827",
  subtext: "#374151",
  bg: "#F6F7F9",
  card: "#FFFFFF",
  border: "#E5E7EB",
  chip: "#F3F4F6",
};

const MARKET_COLORS: Record<
  "Wildberries" | "Ozon" | "Яндекс.Маркет" | "Yandex.Market",
  { bg: string; text: string; border?: string }
> = {
  Wildberries: { bg: "#7C2AA6", text: "#FFFFFF" },
  Ozon: { bg: "#006CFF", text: "#FFFFFF" },
  "Яндекс.Маркет": { bg: "#FFD500", text: "#111111", border: "#E5C700" },
  "Yandex.Market": { bg: "#FFD500", text: "#111111", border: "#E5C700" },
};

const TDICT: Record<
  Lang,
  {
    brand: string;
    langLabel: string;
    heroTitle: string;
    heroLead: string;
    ctas: { partner: string; b2bCta: string; caseOpen: string; caseSame: string };
    badges: string[];
    whyTitle: string;
    why: { title: string; text: string }[];
    howTitle: string;
    how: string[];
    finTitle: string;
    fin: string[];
    trustTitle: string;
    trust: { title: string; text: string }[];
    catsTitle: string;
    cats: string[];
    casesTitle: string;
    casesLead: string;
    caseCategory: string;
    case18: string;
    b2bTitle: string;
    b2bLead: string;
    b2b: { title: string; text: string }[];

    // --- NEW: Partners in China
    partnersTitle: string;
    partnersLead: string;
    partnersCtas: { wechat: string; telegram: string; email: string };
    partnersBullets: string[];

    // --- NEW: Factory mini-FAQ
    faqTitle: string;
    faq: { q: string; a: string }[];

    contactTitle: string;
    contactLead: string;
    emailLabel: string;
    tgLabel: string;
    tgOpen: string;
    wcLabel: string;
    wcHint: string;
    wcCopy: string;
    footer: string;
    mailSubject: string;
    formTitle: string;
    formName: string;
    formEmail: string;
    formPhone: string;
    formSend: string;
    formCancel: string;
    toastOk: string;
    toastFail: string;
  }
> = {
  ru: {
    brand: "Hannkit",
    langLabel: "Язык",
    heroTitle: "Продавайте в России без рисков и вложений",
    heroLead:
      "Мы размещаем ваши товары на Wildberries, Ozon и Яндекс.Маркете, берём на себя маркетинг, логистику и поддержку. Вы получаете себестоимость + 30% от прибыли после продажи.",
    ctas: { partner: "Стать партнёром", b2bCta: "Запросить B2B-условия", caseOpen: "Открыть магазин", caseSame: "Хочу такой же запуск" },
    badges: ["Wildberries", "Ozon", "Яндекс.Маркет"],
    whyTitle: "Почему это выгодно производителю",
    why: [
      { title: "Быстрый выход", text: "Запуск продаж без инвестиций и сложных процедур" },
      { title: "Минимум рисков", text: "Мы берём на себя маркетинг, логистику и поддержку" },
      { title: "Рост прибыли", text: "Вы получаете себестоимость + 30% от прибыли" },
    ],
    howTitle: "Как мы работаем",
    how: ["Анализ спроса и SKU", "Легализация и сертификация", "Поставка на склад", "Продажи на маркетплейсах", "Выплаты и отчёты"],
    finTitle: "Финансовые условия",
    fin: [
      "COGS+30% — стандартное вознаграждение",
      "Выплаты раз в месяц",
      "Все расходы на маркетинг и логистику за нами",
      "Прозрачные отчёты по продажам",
      "SLA по срокам выплат",
    ],
    trustTitle: "Гарантии и прозрачность",
    trust: [
      { title: "Юридическая чистота", text: "Работаем с юрлицами, соблюдаем все нормы" },
      { title: "Прозрачные отчёты", text: "Регулярные дашборды и статистика" },
      { title: "Поддержка 24/7", text: "Отвечаем на любые вопросы партнёров" },
    ],
    catsTitle: "Категории, с которыми работаем",
    cats: ["Малая бытовая техника и электроника", "Товары для красоты и здоровья", "Дом, кухня, уборка", "Спорт и отдых", "Автотовары и инструменты", "Детские товары"],
    casesTitle: "Кейсы магазинов",
    casesLead: "Несколько витрин наших и партнёрских магазинов на Wildberries, Ozon и Яндекс.Маркете.",
    caseCategory: "Категория",
    case18: "Товар для взрослых 18+",
    b2bTitle: "B2B для продавцов маркетплейсов",
    b2bLead: "Оптовые поставки и решения для действующих селлеров.",
    b2b: [
      { title: "Оптовые партии", text: "Выгодные условия закупки от минимального объёма." },
      { title: "White Label", text: "Производство под нашим лейблом на вашем производстве." },
      { title: "Аналитика трендов", text: "Рекомендации по SKU и ассортименту на основе данных." },
      { title: "Готовая логистика", text: "Доставка на склады маркетплейсов без вашего участия." },
    ],

    // --- Partners in China (RU)
    partnersTitle: "Партнёры в Китае",
    partnersLead:
      "Русско- и китайскоязычная команда в CST. Работаем по консигнации (COGS + 30%), контракты CN/EN. WeChat — основной канал связи.",
    partnersCtas: { wechat: "Добавить в WeChat", telegram: "Написать в Telegram", email: "Написать на email" },
    partnersBullets: [
      "Контракты CN/EN + расчёты CN/RU",
      "Консигнация: себестоимость + 30% прибыли",
      "Аналитика спроса по SKU перед запуском",
      "Полный цикл: сертификация, логистика, маркетинг",
    ],

    // --- Factory FAQ (RU)
    faqTitle: "FAQ для фабрик",
    faq: [
      {
        q: "Какой MOQ?",
        a: "Базово работаем от 200–500 шт. на SKU. Для пилота и тестов допускаем меньшие партии при согласовании (с калькуляцией логистики и таможни).",
      },
      {
        q: "Какие Incoterms используете?",
        a: "Предпочтительно FOB China / FCA склад перевозчика в Китае. Возможны EXW/DDP при особых условиях и расчёте маржинальности.",
      },
      {
        q: "Нужны ли образцы?",
        a: "Да. 1–3 образца на SKU для фото-контента, тестов качества и сертификации. Доставка за счёт фабрики либо компенсируется из первой партии.",
      },
      {
        q: "Сертификация нужна?",
        a: "Да, для РФ требуются документы (ЕАЭС, РУ, декларации). Мы берём на себя процесс, от вас — техдокументы и стабильность спецификаций.",
      },
      {
        q: "Как происходит таможня и логистика?",
        a: "Мы организуем доставку и растаможку. В прайс закладываем фрахт, страховку, пошлины. Фабрика пакует и маркирует по нашему гайдлайну.",
      },
    ],

    contactTitle: "Связаться с нами",
    contactLead: "Получите расчёт спроса и тестовую матрицу SKU за 48 часов.",
    emailLabel: "Email",
    tgLabel: "Telegram",
    tgOpen: "Открыть",
    wcLabel: "WeChat",
    wcHint: "Откройте WeChat → Поиск → ID: HardVassya",
    wcCopy: "Скопировать ID",
    footer: "© 2025 Hannkit · hannkit.com. All rights reserved.",
    mailSubject: "Заявка с лендинга Hannkit",
    formTitle: "Оставьте заявку",
    formName: "Ваше имя",
    formEmail: "Email",
    formPhone: "Телефон",
    formSend: "Отправить",
    formCancel: "Отмена",
    toastOk: "Заявка отправлена!",
    toastFail: "Не удалось отправить. Откроем письмо…",
  },
  en: {
    brand: "Hannkit",
    langLabel: "Language",
    heroTitle: "Sell in Russia with zero risk and investment",
    heroLead:
      "We place your products on Wildberries, Ozon and Yandex.Market and handle marketing, logistics and support. You receive cost price + 30% of profit after sale.",
    ctas: { partner: "Become a Partner", b2bCta: "Request B2B Terms", caseOpen: "Open store", caseSame: "Launch same case" },
    badges: ["Wildberries", "Ozon", "Yandex.Market"],
    whyTitle: "Why it’s beneficial for manufacturers",
    why: [
      { title: "Fast launch", text: "Start selling without investment or complex procedures" },
      { title: "Minimal risks", text: "We take care of marketing, logistics and support" },
      { title: "Profit growth", text: "You get cost price + 30% of profit" },
    ],
    howTitle: "How we work",
    how: ["Demand & SKU analysis", "Legalization & certification", "Warehouse delivery", "Marketplace sales", "Payouts & reports"],
    finTitle: "Financial terms",
    fin: ["COGS+30% — standard reward", "Monthly payouts", "We cover marketing & logistics", "Transparent sales reports", "Payouts SLA"],
    trustTitle: "Assurance & transparency",
    trust: [
      { title: "Legal compliance", text: "We work with legal entities and follow all norms" },
      { title: "Transparent reports", text: "Regular dashboards and statistics" },
      { title: "Support 24/7", text: "We answer partner questions around the clock" },
    ],
    catsTitle: "Categories we work with",
    cats: ["Small appliances & electronics", "Beauty & health", "Home & cleaning", "Sport & outdoor", "Auto goods & tools", "Kids"],
    casesTitle: "Store cases",
    casesLead: "A few showcases of our and partners’ stores on Wildberries, Ozon and Yandex.Market.",
    caseCategory: "Category",
    case18: "Adults-only product 18+",
    b2bTitle: "B2B for marketplace sellers",
    b2bLead: "Wholesale supply and solutions for active sellers.",
    b2b: [
      { title: "Wholesale lots", text: "Great purchasing terms from minimal volume." },
      { title: "White Label", text: "Manufacturing under our label at your factory." },
      { title: "Trend analytics", text: "SKU and assortment recommendations based on data." },
      { title: "Ready logistics", text: "Delivery to marketplace warehouses without your participation." },
    ],

    partnersTitle: "Partners in China",
    partnersLead:
      "Bilingual RU/ZH/EN team in CST. Consignment (COGS + 30%), CN/EN contracts. WeChat is the primary channel.",
    partnersCtas: { wechat: "Add on WeChat", telegram: "Message on Telegram", email: "Send Email" },
    partnersBullets: [
      "CN/EN contracts + CN/RU billing",
      "Consignment: cost + 30% profit share",
      "SKU demand analytics prior to launch",
      "Full cycle: certification, logistics, marketing",
    ],

    faqTitle: "Factory mini-FAQ",
    faq: [
      {
        q: "What is the MOQ?",
        a: "Typically 200–500 pcs per SKU. Smaller pilot runs are possible upon agreement (with logistics and customs costed in).",
      },
      {
        q: "Which Incoterms do you use?",
        a: "Prefer FOB China / FCA carrier’s warehouse in China. EXW/DDP are possible if margins allow and terms are aligned.",
      },
      {
        q: "Do you require samples?",
        a: "Yes. 1–3 pcs per SKU for content, quality checks and certification. Shipping covered by factory or reimbursed from the first batch.",
      },
      {
        q: "Is certification needed?",
        a: "Yes, RU/EAEU documents are required. We run the process; you provide tech docs and keep specs stable.",
      },
      {
        q: "How do customs & logistics work?",
        a: "We handle shipping and clearance. Pricing includes freight, insurance and duties. Factory packs & labels per our guideline.",
      },
    ],

    contactTitle: "Contact us",
    contactLead: "Get demand estimation and a trial SKU matrix within 48 hours.",
    emailLabel: "Email",
    tgLabel: "Telegram",
    tgOpen: "Open",
    wcLabel: "WeChat",
    wcHint: "Open WeChat → Search → ID: HardVassya",
    wcCopy: "Copy ID",
    footer: "© 2025 Hannkit · hannkit.com. All rights reserved.",
    mailSubject: "Hannkit landing request",
    formTitle: "Leave a request",
    formName: "Your name",
    formEmail: "Email",
    formPhone: "Phone",
    formSend: "Send",
    formCancel: "Cancel",
    toastOk: "Request sent!",
    toastFail: "Failed to send. Opening email…",
  },
  zh: {
    brand: "Hannkit",
    langLabel: "语言",
    heroTitle: "零风险零投入进入俄罗斯市场",
    heroLead: "我们将您的产品上架至 Wildberries、Ozon 与 Yandex.Market，并负责营销、物流与支持。售出后您获得成本价 + 30% 的利润。",
    ctas: { partner: "成为合作伙伴", b2bCta: "索取 B2B 条款", caseOpen: "打开店铺", caseSame: "复制该案例" },
    badges: ["Wildberries", "Ozon", "Yandex.Market"],
    whyTitle: "对制造商的优势",
    why: [
      { title: "快速启动", text: "无需投入与复杂流程即可开始销售" },
      { title: "风险最小化", text: "我们负责营销、物流与支持" },
      { title: "利润提升", text: "售后获得成本价 + 30% 的利润" },
    ],
    howTitle: "我们的流程",
    how: ["需求与 SKU 分析", "合规与认证", "入仓", "平台销售", "结算与报表"],
    finTitle: "财务条款",
    fin: ["COGS+30% — 标准返佣", "每月结算", "营销与物流费用由我们承担", "透明销售报表", "付款 SLA"],
    trustTitle: "保障与透明",
    trust: [
      { title: "合法合规", text: "与法人合作并遵守法规" },
      { title: "透明报表", text: "定期看板与统计" },
      { title: "7×24 支持", text: "随时解答合作伙伴问题" },
    ],
    catsTitle: "合作品类",
    cats: ["小家电与电子", "美容与健康", "家居与清洁", "运动与户外", "汽车用品与工具", "母婴童品"],
    casesTitle: "店铺案例",
    casesLead: "我们与合作伙伴在 Wildberries、Ozon、Yandex.Market 的部分店铺展示。",
    caseCategory: "品类",
    case18: "成人商品 18+",
    b2bTitle: "面向平台卖家的 B2B",
    b2bLead: "为在营卖家提供批发与解决方案。",
    b2b: [
      { title: "批发采购", text: "从最小量起即可享受优惠条件。" },
      { title: "白标代工", text: "在您的工厂使用我们的品牌生产。" },
      { title: "趋势分析", text: "基于数据给出 SKU 与品类建议。" },
      { title: "成套物流", text: "无需参与即可直送平台仓。" },
    ],

    partnersTitle: "中国合作方",
    partnersLead:
      "中俄英团队（CST）。寄售模式（成本价 + 30% 利润），支持中/英合同。首选联系渠道：WeChat。",
    partnersCtas: { wechat: "添加 WeChat", telegram: "联系 Telegram", email: "发送邮箱" },
    partnersBullets: [
      "中/英合同 + 中/俄结算",
      "寄售：成本 + 30% 分成",
      "上架前进行 SKU 需求分析",
      "全链路：认证、物流、营销",
    ],

    faqTitle: "工厂常见问答",
    faq: [
      {
        q: "MOQ 是多少？",
        a: "通常每个 SKU 200–500 件。试销可协商更小批量（需计入物流与清关成本）。",
      },
      {
        q: "使用哪些贸易术语（Incoterms）？",
        a: "优先 FOB 中国 / FCA 中国承运仓。若利润允许并约定到位，可用 EXW/DDP。",
      },
      {
        q: "是否需要样品？",
        a: "需要。每个 SKU 1–3 件，用于内容拍摄、质检与认证。运费由工厂承担或在首单中抵扣。",
      },
      {
        q: "是否需要认证？",
        a: "进入俄罗斯/欧亚市场需要相关证书。我们负责流程，贵司提供技术文件并保持规格稳定。",
      },
      {
        q: "清关与物流如何安排？",
        a: "由我们负责运输及清关。报价会包含运费、保险与关税。工厂按我们的规范进行包装与贴标。",
      },
    ],

    contactTitle: "联系我们",
    contactLead: "48 小时内提供需求评估与试用 SKU 矩阵。",
    emailLabel: "邮箱",
    tgLabel: "Telegram",
    tgOpen: "打开",
    wcLabel: "WeChat",
    wcHint: "打开 WeChat → 搜索 → ID: HardVassya",
    wcCopy: "复制 ID",
    footer: "© 2025 Hannkit · hannkit.com. All rights reserved.",
    mailSubject: "Hannkit 合作请求",
    formTitle: "提交咨询",
    formName: "姓名",
    formEmail: "邮箱",
    formPhone: "电话",
    formSend: "发送",
    formCancel: "取消",
    toastOk: "已发送！",
    toastFail: "发送失败，改用邮件…",
  },
};

// --------- Cases data (images + click URLs) ---------
type CaseCard = {
  brand: string;
  market: "Wildberries" | "Ozon" | "Яндекс.Маркет" | "Yandex.Market";
  category: { ru: string; en: string; zh: string };
  bulletsKey: (
    | "assort"
    | "seo"
    | "reviews"
    | "optCards"
    | "content"
    | "promo"
    | "sizes"
    | "showcase"
    | "relevantKeys"
    | "policies"
    | "pricing"
    | "recs"
  )[];
  img?: string; // if absent — show 18+ stub
  click: string; // link to store
};

const CASES: CaseCard[] = [
  {
    brand: "OMX",
    market: "Wildberries",
    category: { ru: "Бытовая техника", en: "Small appliances", zh: "小家电" },
    bulletsKey: ["assort", "seo", "reviews"],
    img: "https://basket-13.wbbasket.ru/vol1945/part194511/194511252/images/big/1.webp",
    click: "https://www.wildberries.ru/seller/94640",
  },
  {
    brand: "OMX",
    market: "Ozon",
    category: { ru: "Бытовая техника", en: "Small appliances", zh: "小家电" },
    bulletsKey: ["optCards", "reviews"],
    img: "https://ir.ozone.ru/s3/multimedia-1-p/wc1000/7372434949.jpg",
    click: "https://www.ozon.ru/seller/omx-611623",
  },
  {
    brand: "Print Tees",
    market: "Wildberries",
    category: { ru: "Футболки с принтами", en: "Printed tees", zh: "印花T恤" },
    bulletsKey: ["content", "promo", "sizes"],
    img: "https://basket-18.wbbasket.ru/vol2892/part289294/289294687/images/big/1.webp",
    click: "https://www.wildberries.ru/seller/235322",
  },
  {
    brand: "Handmade Bags «loombloom»",
    market: "Wildberries",
    category: { ru: "Вязаные сумки и футболки", en: "Crochet bags & tees", zh: "钩织包与T恤" },
    bulletsKey: ["showcase", "assort", "promo"],
    img: "https://basket-27.wbbasket.ru/vol4951/part495135/495135155/images/big/1.webp",
    click: "https://www.wildberries.ru/seller/4499972",
  },
  {
    brand: "Wow Shtuchki (18+)",
    market: "Ozon",
    category: { ru: "Товары для взрослых (18+)", en: "Adults-only (18+)", zh: "成人用品(18+)" },
    bulletsKey: ["assort", "relevantKeys", "policies"],
    // no image -> 18+ stub
    click: "https://www.ozon.ru/seller/wow-shtuchki-664611",
  },
  {
    brand: "SHT (18+)",
    market: "Яндекс.Маркет",
    category: { ru: "Товары для взрослых (18+)", en: "Adults-only (18+)", zh: "成人用品(18+)" },
    bulletsKey: ["content", "pricing", "recs"],
    click: "https://market.yandex.ru/business--sht/51251801?generalContext=t%3DshopInShop%3Bi%3D1%3Bbi%3D51251801%3B&rs=eJwzkv_EKMPBKLDwEKsEg8aufwflNd53HJLX2Nt1Sl7j-6pT8gC_dg1E&searchContext=sins_ctx",
  },
];

// локализованные буллеты для кейсов
const CASE_BULLETS: Record<
  Lang,
  Record<NonNullable<CaseCard["bulletsKey"][number]>, string>
> = {
  ru: {
    assort: "Ассортимент",
    seo: "SEO карточек",
    reviews: "Отзывы / Q&A",
    optCards: "Оптимизация карточек",
    content: "Контент",
    promo: "Промо",
    sizes: "Размерные сетки",
    showcase: "Витрина",
    relevantKeys: "Релевантные ключи",
    policies: "Политики площадки",
    pricing: "Ценообразование",
    recs: "Рекомендации",
  },
  en: {
    assort: "Assortment",
    seo: "SEO cards",
    reviews: "Reviews / Q&A",
    optCards: "Card optimization",
    content: "Content",
    promo: "Promotions",
    sizes: "Size charts",
    showcase: "Showcase",
    relevantKeys: "Relevant keywords",
    policies: "Platform policies",
    pricing: "Pricing",
    recs: "Recommendations",
  },
  zh: {
    assort: "商品结构",
    seo: "SEO 优化",
    reviews: "评价 / 问答",
    optCards: "卡片优化",
    content: "内容",
    promo: "促销",
    sizes: "尺码表",
    showcase: "橱窗",
    relevantKeys: "相关关键词",
    policies: "平台政策",
    pricing: "定价",
    recs: "建议",
  },
};

export default function Landing() {
  const [lang, setLang] = useState<Lang>("ru");
  const T = useMemo(() => TDICT[lang], [lang]);

  const isTablet = useMedia("(max-width: 1024px)");
  const isMobile = useMedia("(max-width: 640px)");

  const [openLead, setOpenLead] = useState(false);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState<string | undefined>();

  const contactRef = useRef<HTMLDivElement>(null);
  const openModal = () => setOpenLead(true);

  const FORMSPREE = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  const sendLead = async () => {
    if (FORMSPREE) {
      try {
        const r = await fetch(FORMSPREE, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email: mail, phone, source: "hannkit.com", lang }),
        });
        if (r.ok) {
          alert(T.toastOk);
          setOpenLead(false);
          setName("");
          setMail("");
          setPhone(undefined);
          return;
        }
      } catch {}
    }
    alert(T.toastFail);
    const subject = T.mailSubject;
    const body = `${T.formName}: ${name || "-"}\n${T.formEmail}: ${mail || "-"}\n${T.formPhone}: ${phone || "-"}`;
    const href = `mailto:Wildbizshop@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (typeof window !== "undefined") window.location.href = href;
    setOpenLead(false);
  };

  const copyWeChat = async () => {
    try {
      await navigator.clipboard.writeText("HardVassya");
      alert(lang === "ru" ? "ID скопирован" : lang === "en" ? "ID copied" : "已复制 ID");
    } catch {
      alert(lang === "ru" ? "Не удалось скопировать" : lang === "en" ? "Copy failed" : "复制失败");
    }
  };

  // Close modal by Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenLead(false);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, []);

  return (
    <div
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
        color: COLORS.text,
        background: COLORS.bg,
      }}
    >
      {/* mobile header tweaks */}
      <style>{`
        @media (max-width: 640px) {
          .hdr__wrap { flex-wrap: wrap; row-gap: 8px; padding: 10px 12px !important; }
          .hdr__brand { font-size: 20px !important; margin-right: auto; }
          .hdr__label { display: none; }
          .hdr__right { width: 100%; justify-content: flex-start; flex-wrap: wrap; gap: 6px; }
          .hdr__langbtn { padding: 6px 10px; font-size: 14px; }
          .hdr__cta { padding: 8px 12px !important; font-size: 14px; border-radius: 10px; }
          .hero__title { font-size: 32px !important; line-height: 1.15; }
          .hero__lead { font-size: 16px !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ background: COLORS.brand, color: "#fff", position: "sticky", top: 0, zIndex: 20, borderBottom: `1px solid ${COLORS.brandSoft}` }}>
        <div
          className="hdr__wrap"
          style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "14px 16px" : "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
        >
          <div className="hdr__brand" style={{ fontWeight: 700, fontSize: isMobile ? 20 : 22, lineHeight: 1 }}>
            {T.brand}
          </div>

          <div className="hdr__right" style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <span className="hdr__label" style={{ opacity: 0.85, marginRight: 6 }}>
              {T.langLabel}:
            </span>
            {(["ru", "en", "zh"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="hdr__langbtn"
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${l === lang ? "#fff" : "rgba(255,255,255,.35)"}`,
                  background: l === lang ? "#fff" : "transparent",
                  color: l === lang ? COLORS.brand : "#fff",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
            <button
              onClick={openModal}
              className="hdr__cta"
              style={{ marginLeft: 12, padding: "8px 14px", background: "#fff", color: COLORS.brand, border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {T.ctas.partner}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: COLORS.brand, color: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "28px 16px 26px" : "38px 20px 34px" }}>
          <h1 className="hero__title" style={{ fontSize: isMobile ? 30 : 44, lineHeight: 1.15, letterSpacing: 0.2, margin: "0 0 14px" }}>{T.heroTitle}</h1>
          <p className="hero__lead" style={{ maxWidth: 840, fontSize: isMobile ? 16 : 18, lineHeight: 1.6, opacity: 0.95 }}>{T.heroLead}</p>

          <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={openModal}
              style={{ padding: "10px 16px", background: "#fff", color: COLORS.brand, border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", width: isMobile ? "100%" : "auto" }}
            >
              {T.ctas.partner}
            </button>

            {T.badges.map((b, i) => {
              const style = MARKET_COLORS[b as keyof typeof MARKET_COLORS] || { bg: "rgba(255,255,255,.12)", text: "#fff" };
              return (
                <span
                  key={i}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: style.bg,
                    color: style.text,
                    border: style.border ? `1px solid ${style.border}` : "1px solid rgba(255,255,255,.12)",
                    fontWeight: 600,
                  }}
                >
                  {b}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "20px 16px 6px" : "36px 20px 6px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 16px" }}>{T.whyTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 14 }}>
          {T.why.map((card, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{card.title}</div>
              <div style={{ color: COLORS.subtext }}>{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How + Financials (вместе, две колонки) */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "12px 16px" : "24px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, alignItems: "start" }}>
          {/* How */}
          <div>
            <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.howTitle}</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: COLORS.subtext, margin: 0 }}>
              {T.how.map((li, i) => (
                <li key={i}>{li}</li>
              ))}
            </ul>
          </div>
          {/* Financials */}
          <div>
            <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.finTitle}</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: COLORS.subtext, margin: 0 }}>
              {T.fin.map((li, i) => (
                <li key={i}>{li}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "8px 16px 20px" : "10px 20px 24px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 16px" }}>{T.trustTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 14 }}>
          {T.trust.map((card, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{card.title}</div>
              <div style={{ color: COLORS.subtext }}>{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "8px 16px 24px" : "10px 20px 28px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.catsTitle}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 8 : 10 }}>
          {T.cats.map((c, i) => (
            <span key={i} style={{ background: COLORS.chip, border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "8px 12px" }}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* CASES */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "8px 16px 28px" : "10px 20px 32px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 6px" }}>{T.casesTitle}</h2>
        <p style={{ color: COLORS.subtext, margin: "0 0 16px" }}>{T.casesLead}</p>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 18 }}>
          {CASES.map((c, idx) => {
            const mcolor = MARKET_COLORS[c.market === "Yandex.Market" ? "Yandex.Market" : (c.market as any)];
            return (
              <div key={idx} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: "hidden" }}>
                {/* Image / 18+ */}
                <a href={c.click} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: 16 }}>
                  <div
                    style={{
                      border: `2px solid ${COLORS.border}`,
                      borderRadius: 12,
                      height: 340,
                      overflow: "hidden",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.img} alt={c.brand} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ padding: 20, color: COLORS.text, fontWeight: 700, textAlign: "center" }}>{T.case18}</div>
                    )}
                  </div>
                </a>

                <div style={{ padding: 16, paddingTop: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12 }}>
                    <div style={{ fontWeight: 700 }}>{c.brand}</div>
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: mcolor.bg,
                        color: mcolor.text,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {c.market}
                    </span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 12, color: COLORS.subtext, marginBottom: 6 }}>{T.caseCategory}</div>
                    <div
                      style={{
                        display: "inline-block",
                        background: COLORS.chip,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 10,
                        padding: "6px 10px",
                        fontWeight: 700,
                      }}
                    >
                      {c.category[lang]}
                    </div>
                  </div>

                  <ul style={{ margin: "10px 0 0", paddingLeft: 20, color: COLORS.subtext, lineHeight: 1.7 }}>
                    {c.bulletsKey.map((k, i) => (
                      <li key={i}>{CASE_BULLETS[lang][k]}</li>
                    ))}
                  </ul>

                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <a
                      href={c.click}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: COLORS.chip,
                        border: `1px solid ${COLORS.border}`,
                        textDecoration: "none",
                        color: COLORS.text,
                        fontWeight: 600,
                      }}
                    >
                      {T.ctas.caseOpen}
                    </a>
                    <button
                      onClick={openModal}
                      style={{ padding: "10px 14px", borderRadius: 10, background: COLORS.brand, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
                    >
                      {T.ctas.caseSame}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* B2B */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "4px 16px 28px" : "6px 20px 34px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 6px" }}>{T.b2bTitle}</h2>
        <p style={{ color: COLORS.subtext, margin: "0 0 14px" }}>{T.b2bLead}</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 14 }}>
          {T.b2b.map((b, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{b.title}</div>
              <div style={{ color: COLORS.subtext }}>{b.text}</div>
            </div>
          ))}
        </div>
        <button
          onClick={openModal}
          style={{ marginTop: 12, padding: isMobile ? "10px 14px" : "10px 16px", background: COLORS.brand, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", width: isMobile ? "100%" : "auto" }}
        >
          {T.ctas.b2bCta}
        </button>
      </section>

      {/* Partners in China */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "8px 16px 28px" : "10px 20px 32px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 8px" }}>{T.partnersTitle}</h2>
        <p style={{ color: COLORS.subtext, margin: "0 0 14px", maxWidth: 860 }}>{T.partnersLead}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: 14,
          }}
        >
          {T.partnersBullets.map((b, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ color: COLORS.subtext }}>{b}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button
            onClick={copyWeChat}
            style={{ padding: "10px 14px", borderRadius: 12, background: COLORS.brand, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
          >
            {T.partnersCtas.wechat} · ID: HardVassya
          </button>
          <a
            href="https://t.me/HardVassya"
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: "10px 14px", borderRadius: 12, background: COLORS.chip, border: `1px solid ${COLORS.border}`, textDecoration: "none", color: COLORS.text, fontWeight: 600 }}
          >
            {T.partnersCtas.telegram}
          </a>
          <a
            href="mailto:Wildbizshop@gmail.com?subject=China%20partnership"
            style={{ padding: "10px 14px", borderRadius: 12, background: COLORS.chip, border: `1px solid ${COLORS.border}`, textDecoration: "none", color: COLORS.text, fontWeight: 600 }}
          >
            {T.partnersCtas.email}
          </a>
        </div>
      </section>

      {/* Factory mini-FAQ */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "6px 16px 28px" : "8px 20px 34px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 10px" }}>{T.faqTitle}</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
          {T.faq.map((item, i) => (
            <details
              key={i}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: 700, outline: "none" }}>{item.q}</summary>
              <div style={{ marginTop: 8, color: COLORS.subtext, lineHeight: 1.7 }}>{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Contacts */}
      <section ref={contactRef} style={{ background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "18px 16px 28px" : "22px 20px 36px" }}>
          <h2 style={{ fontSize: 26, margin: "0 0 6px" }}>{T.contactTitle}</h2>
          <p style={{ color: COLORS.subtext, margin: "0 0 14px" }}>{T.contactLead}</p>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 14 }}>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{T.emailLabel}</div>
              <a href="mailto:Wildbizshop@gmail.com" style={{ color: COLORS.brand, textDecoration: "none", fontWeight: 600 }}>
                Wildbizshop@gmail.com
              </a>
            </div>

            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{T.tgLabel}</div>
              <a href="https://t.me/HardVassya" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.brand, textDecoration: "none", fontWeight: 600 }}>
                @HardVassya — {T.tgOpen}
              </a>
            </div>

            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{T.wcLabel}</div>
              <div style={{ marginBottom: 8 }}>
                ID: <b>HardVassya</b>
              </div>
              <button onClick={copyWeChat} style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.chip, cursor: "pointer" }}>
                {T.wcCopy}
              </button>
              <div style={{ marginTop: 8, color: COLORS.subtext, fontSize: 13 }}>{T.wcHint}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${COLORS.border}`, background: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 20px", color: COLORS.subtext }}>{T.footer}</div>
      </footer>

      {/* Modal mini-form */}
      {openLead && (
        <div onClick={() => setOpenLead(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: isMobile ? 320 : 380, background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 18, boxShadow: "0 12px 32px rgba(0,0,0,.18)" }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{T.formTitle}</div>
            <div style={{ display: "grid", gap: 10 }}>
              <input placeholder={T.formName} value={name} onChange={(e) => setName(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, outline: "none" }} />
              <input placeholder={T.formEmail} value={mail} onChange={(e) => setMail(e.target.value)} type="email" style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, outline: "none" }} />
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, color: COLORS.subtext }}>{T.formPhone}</label>
                <PhoneInput
                  defaultCountry="RU"
                  international
                  countryCallingCodeEditable={true}
                  value={phone}
                  onChange={setPhone}
                  placeholder="+7 900 000-00-00"
                  numberInputProps={{
                    style: { padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, outline: "none", width: "100%" },
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setOpenLead(false)} style={{ padding: "9px 12px", background: COLORS.chip, border: `1px solid ${COLORS.border}`, borderRadius: 10, cursor: "pointer" }}>
                {T.formCancel}
              </button>
              <button onClick={sendLead} style={{ padding: "9px 14px", background: COLORS.brand, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
                {T.formSend}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
