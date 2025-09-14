import React, { useEffect, useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input"; // CSS уже подключен в _app.tsx

// ===== Helpers / Responsive (fixed for TS on Vercel) =====
function useMedia(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;

    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);

    // первичная установка
    update();

    // современный API
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }

    // устаревший API для Safari/старых браузеров
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

/* ==================== CASES DATA (языконезависимая) ==================== */
type CaseItem = {
  id: string;
  brand: string; // НЕ переводим
  marketplace: "Wildberries" | "Ozon" | "Яндекс.Маркет" | "Yandex.Market";
  // image / link
  imageUrl?: string; // если 18+, не указываем, будет текст-заглушка
  linkUrl: string; // куда ведёт клик по рамке
  // семантика для переводов:
  categoryKey: "appliances" | "tees" | "handmade" | "adults";
  actionKeys?: Array<
    | "assortment"
    | "seo"
    | "reviews"
    | "content"
    | "promo"
    | "sizecharts"
    | "showcase"
    | "pricing"
    | "policies"
    | "recommendedKeys"
    | "recommendations"
  >;
  adults?: boolean; // 18+
};

const CASES: CaseItem[] = [
  {
    id: "wb-omx",
    brand: "OMX",
    marketplace: "Wildberries",
    imageUrl:
      "https://basket-13.wbbasket.ru/vol1945/part194511/194511252/images/big/1.webp",
    linkUrl:
      "https://basket-13.wbbasket.ru/vol1945/part194511/194511252/images/big/1.webp",
    categoryKey: "appliances",
    actionKeys: ["assortment", "seo", "reviews"],
  },
  {
    id: "ozon-omx",
    brand: "OMX",
    marketplace: "Ozon",
    imageUrl:
      "https://ir.ozone.ru/s3/multimedia-1-p/wc1000/7372434949.jpg",
    linkUrl:
      "https://www.ozon.ru/product/7372434949/", // целевая страница товара (если нужна другая — подставь)
    categoryKey: "appliances",
    actionKeys: ["seo", "reviews"],
  },
  {
    id: "wb-print-tees",
    brand: "Print Tees",
    marketplace: "Wildberries",
    imageUrl:
      "https://basket-18.wbbasket.ru/vol2892/part289294/289294687/images/big/1.webp",
    linkUrl:
      "https://basket-18.wbbasket.ru/vol2892/part289294/289294687/images/big/1.webp",
    categoryKey: "tees",
    actionKeys: ["content", "promo", "sizecharts"],
  },
  {
    id: "wb-loombloom",
    brand: "Handmade Bags «loombloom»",
    marketplace: "Wildberries",
    imageUrl:
      "https://basket-27.wbbasket.ru/vol4951/part495135/495135155/images/big/1.webp",
    linkUrl:
      "https://basket-27.wbbasket.ru/vol4951/part495135/495135155/images/big/1.webp",
    categoryKey: "handmade",
    actionKeys: ["showcase", "assortment", "promo"],
  },
  {
    id: "ozon-wow",
    brand: "Wow Shtuchki",
    marketplace: "Ozon",
    linkUrl: "https://www.ozon.ru/seller/wow-shtuchki-664611",
    adults: true,
    categoryKey: "adults",
    actionKeys: ["assortment", "recommendedKeys", "policies"],
  },
  {
    id: "ym-sht",
    brand: "SHT",
    marketplace: "Яндекс.Маркет",
    linkUrl: "https://market.yandex.ru/business--sht/51251801",
    adults: true,
    categoryKey: "adults",
    actionKeys: ["content", "pricing", "recommendations"],
  },
];

/* ==================== ПЕРЕВОДЫ ==================== */
const TDICT: Record<
  Lang,
  {
    brand: string;
    langLabel: string;
    heroTitle: string;
    heroLead: string;
    ctas: { partner: string; b2bCta: string };
    badges: string[];
    whyTitle: string;
    why: { title: string; text: string }[];
    howTitle: string;
    how: string[];
    finTitle: string;
    fin: string[];
    trustTitle: string;
    trust: { title: string; text: string }[];
    /* cases */
    casesTitle: string;
    casesLead: string;
    casesCategory: string; // "Категория"
    casesShop: string; // "Открыть магазин"
    casesCTA: string; // "Хочу такой же запуск"
    casesAdults: string; // "Товар для взрослых 18+"
    caseCats: Record<CaseItem["categoryKey"], string>;
    caseActions: Record<NonNullable<CaseItem["actionKeys"]>[number], string>;
    /* categories section etc. */
    catsTitle: string;
    cats: string[];
    b2bTitle: string;
    b2bLead: string;
    b2b: { title: string; text: string }[];
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
    ctas: { partner: "Стать партнёром", b2bCta: "Запросить B2B-условия" },
    badges: ["Wildberries", "Ozon", "Яндекс.Маркет"],
    whyTitle: "Почему это выгодно производителю",
    why: [
      { title: "Быстрый выход", text: "Запуск продаж без инвестиций и сложных процедур" },
      { title: "Минимум рисков", text: "Мы берём на себя маркетинг, логистику и поддержку" },
      { title: "Рост прибыли", text: "Вы получаете себестоимость + 30% от прибыли" },
    ],
    howTitle: "Как мы работаем",
    how: [
      "Анализ спроса и SKU",
      "Легализация и сертификация",
      "Поставка на склад",
      "Продажи на маркетплейсах",
      "Выплаты и отчёты",
    ],
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
    /* cases */
    casesTitle: "Кейсы магазинов",
    casesLead:
      "Несколько витрин наших и партнёрских магазинов на Wildberries, Ozon и Яндекс.Маркете.",
    casesCategory: "Категория",
    casesShop: "Открыть магазин",
    casesCTA: "Хочу такой же запуск",
    casesAdults: "Товар для взрослых 18+",
    caseCats: {
      appliances: "Бытовая техника",
      tees: "Футболки с принтами",
      handmade: "Вязаные сумки и футболки",
      adults: "Товары для взрослых (18+)",
    },
    caseActions: {
      assortment: "Ассортимент",
      seo: "SEO карточек",
      reviews: "Отзывы / Q&A",
      content: "Контент",
      promo: "Промо",
      sizecharts: "Размерные сетки",
      showcase: "Витрина",
      pricing: "Ценообразование",
      policies: "Политики площадки",
      recommendedKeys: "Релевантные ключи",
      recommendations: "Рекомендации",
    },
    /* categories etc. */
    catsTitle: "Категории, с которыми работаем",
    cats: [
      "Малая бытовая техника и электроника",
      "Товары для красоты и здоровья",
      "Дом, кухня, уборка",
      "Спорт и отдых",
      "Автотовары и инструменты",
      "Детские товары",
    ],
    b2bTitle: "B2B для продавцов маркетплейсов",
    b2bLead: "Оптовые поставки и решения для действующих селлеров.",
    b2b: [
      { title: "Оптовые партии", text: "Выгодные условия закупки от минимального объёма." },
      { title: "White Label", text: "Производство под нашим лейблом на вашем производстве." },
      { title: "Аналитика трендов", text: "Рекомендации по SKU и ассортименту на основе данных." },
      { title: "Готовая логистика", text: "Доставка на склады маркетплейсов без вашего участия." },
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
    ctas: { partner: "Become a Partner", b2bCta: "Request B2B Terms" },
    badges: ["Wildberries", "Ozon", "Yandex.Market"],
    whyTitle: "Why it’s beneficial for manufacturers",
    why: [
      { title: "Fast launch", text: "Start selling without investment or complex procedures" },
      { title: "Minimal risks", text: "We take care of marketing, logistics and support" },
      { title: "Profit growth", text: "You get cost price + 30% of profit" },
    ],
    howTitle: "How we work",
    how: [
      "Demand & SKU analysis",
      "Legalization & certification",
      "Warehouse delivery",
      "Marketplace sales",
      "Payouts & reports",
    ],
    finTitle: "Financial terms",
    fin: [
      "COGS+30% — standard reward",
      "Monthly payouts",
      "We cover marketing & logistics",
      "Transparent sales reports",
      "Payouts SLA",
    ],
    trustTitle: "Assurance & transparency",
    trust: [
      { title: "Legal compliance", text: "We work with legal entities and follow all norms" },
      { title: "Transparent reports", text: "Regular dashboards and statistics" },
      { title: "Support 24/7", text: "We answer partner questions around the clock" },
    ],
    casesTitle: "Store cases",
    casesLead:
      "A few storefronts from our own and partner stores on Wildberries, Ozon and Yandex.Market.",
    casesCategory: "Category",
    casesShop: "Open store",
    casesCTA: "I want the same launch",
    casesAdults: "Adults-only product 18+",
    caseCats: {
      appliances: "Small appliances",
      tees: "Printed T-shirts",
      handmade: "Knitted bags & tees",
      adults: "Adults products (18+)",
    },
    caseActions: {
      assortment: "Assortment",
      seo: "SEO for listings",
      reviews: "Reviews / Q&A",
      content: "Content",
      promo: "Promo",
      sizecharts: "Size charts",
      showcase: "Storefront",
      pricing: "Pricing",
      policies: "Marketplace policies",
      recommendedKeys: "Relevant keywords",
      recommendations: "Recommendations",
    },
    catsTitle: "Categories we work with",
    cats: [
      "Small appliances & electronics",
      "Beauty & health",
      "Home & cleaning",
      "Sport & outdoor",
      "Auto goods & tools",
      "Kids",
    ],
    b2bTitle: "B2B for marketplace sellers",
    b2bLead: "Wholesale supply and solutions for active sellers.",
    b2b: [
      { title: "Wholesale lots", text: "Great purchasing terms from minimal volume." },
      { title: "White Label", text: "Manufacturing under our label at your factory." },
      { title: "Trend analytics", text: "SKU and assortment recommendations based on data." },
      { title: "Ready logistics", text: "Delivery to marketplace warehouses without your participation." },
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
    heroLead:
      "我们将您的产品上架至 Wildberries、Ozon 与 Yandex.Market，并负责营销、物流与支持。售出后您获得成本价 + 30% 的利润。",
    ctas: { partner: "成为合作伙伴", b2bCta: "索取 B2B 条款" },
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
    casesTitle: "店铺案例",
    casesLead: "我们与合作伙伴在 Wildberries、Ozon、Yandex.Market 的部分店铺。",
    casesCategory: "品类",
    casesShop: "打开店铺",
    casesCTA: "我要同样的启动",
    casesAdults: "仅限成人 18+",
    caseCats: {
      appliances: "小家电",
      tees: "印花 T 恤",
      handmade: "针织包与 T 恤",
      adults: "成人用品（18+）",
    },
    caseActions: {
      assortment: "品类规划",
      seo: "商品 SEO",
      reviews: "评价 / 问答",
      content: "内容",
      promo: "促销",
      sizecharts: "尺码表",
      showcase: "店铺橱窗",
      pricing: "定价",
      policies: "平台政策",
      recommendedKeys: "关键词匹配",
      recommendations: "建议",
    },
    catsTitle: "合作品类",
    cats: ["小家电与电子", "美容与健康", "家居与清洁", "运动与户外", "汽车用品与工具", "母婴童品"],
    b2bTitle: "面向平台卖家的 B2B",
    b2bLead: "为在营卖家提供批发与解决方案。",
    b2b: [
      { title: "批发采购", text: "从最小量起即可享受优惠条件。" },
      { title: "白标代工", text: "在您的工厂使用我们的品牌生产。" },
      { title: "趋势分析", text: "基于数据给出 SKU 与品类建议。" },
      { title: "成套物流", text: "无需参与即可直送平台仓。" },
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
          body: JSON.stringify({
            name,
            email: mail,
            phone,
            source: "hannkit.com",
            lang,
          }),
        });
        if (r.ok) {
          alert(T.toastOk);
          setOpenLead(false);
          setName("");
          setMail("");
          setPhone(undefined);
          return;
        }
      } catch {
        /* fallthrough */
      }
    }

    alert(T.toastFail);
    const subject = T.mailSubject;
    const body =
      `${T.formName}: ${name || "-"}\n` +
      `${T.formEmail}: ${mail || "-"}\n` +
      `${T.formPhone}: ${phone || "-"}`;
    const href = `mailto:Wildbizshop@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`;
    window.location.href = href;
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

  return (
    <div
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
        color: COLORS.text,
        background: COLORS.bg,
      }}
    >
      {/* Адаптив для хедера/героя */}
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
      <header
        style={{
          background: COLORS.brand,
          color: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 20,
          borderBottom: `1px solid ${COLORS.brandSoft}`,
        }}
      >
        <div
          className="hdr__wrap"
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: isMobile ? "14px 16px" : "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
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
              style={{
                marginLeft: 12,
                padding: "8px 14px",
                background: "#fff",
                color: COLORS.brand,
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {T.ctas.partner}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: COLORS.brand, color: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "28px 16px 26px" : "38px 20px 34px" }}>
          <h1 className="hero__title" style={{ fontSize: isMobile ? 30 : 44, lineHeight: 1.15, letterSpacing: 0.2, margin: "0 0 14px" }}>
            {T.heroTitle}
          </h1>
          <p className="hero__lead" style={{ maxWidth: 840, fontSize: isMobile ? 16 : 18, lineHeight: 1.6, opacity: 0.95 }}>
            {T.heroLead}
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={openModal}
              style={{
                padding: "10px 16px",
                background: "#fff",
                color: COLORS.brand,
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
                width: isMobile ? "100%" : "auto",
              }}
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

      {/* How */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "12px 16px" : "24px 20px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.howTitle}</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: COLORS.subtext, margin: 0 }}>
          {T.how.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      </section>

      {/* Financials */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "10px 16px 20px" : "12px 20px 24px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.finTitle}</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: COLORS.subtext, margin: 0 }}>
          {T.fin.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
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

      {/* ==================== CASES (обновлено) ==================== */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "8px 16px 24px" : "10px 20px 28px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.casesTitle}</h2>
        <p style={{ color: COLORS.subtext, margin: "0 0 14px" }}>{T.casesLead}</p>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 14 }}>
          {CASES.map((c) => {
            const m = MARKET_COLORS[c.marketplace] || { bg: "rgba(0,0,0,.06)", text: COLORS.text };
            return (
              <article
                key={c.id}
                style={{
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Блок-рамка одинакового размера (3:4) */}
                <a
                  href={c.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      margin: "16px 16px 0",
                      borderRadius: 14,
                      border: "2px solid #111",
                      position: "relative",
                      width: "calc(100% - 32px)",
                      // 3:4 -> высота = ширина * 4/3 -> paddingTop = 133.33%
                      paddingTop: "133.33%",
                      overflow: "hidden",
                      background: "#fff",
                    }}
                  >
                    {c.adults ? (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 12,
                          textAlign: "center",
                          fontWeight: 800,
                          fontSize: 20,
                        }}
                      >
                        {T.casesAdults}
                      </div>
                    ) : (
                      c.imageUrl && (
                        <img
                          src={c.imageUrl}
                          alt={`${c.brand} — ${c.marketplace}`}
                          loading="lazy"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )
                    )}
                  </div>
                </a>

                {/* Текст */}
                <div style={{ padding: 16, display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                      {c.brand} {c.adults ? <span style={{ fontSize: 12, opacity: 0.7 }}>(18+)</span> : null}
                    </div>
                    <span
                      style={{
                        background: m.bg,
                        color: m.text,
                        border: m.border ? `1px solid ${m.border}` : "transparent",
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        fontSize: 12,
                      }}
                    >
                      {c.marketplace}
                    </span>
                  </div>

                  {/* KPI: Категория */}
                  <div
                    style={{
                      background: COLORS.chip,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                      width: "fit-content",
                    }}
                  >
                    <div style={{ fontSize: 12, color: COLORS.subtext }}>{T.casesCategory}</div>
                    <div style={{ fontWeight: 700 }}>{T.caseCats[c.categoryKey]}</div>
                  </div>

                  {/* Действия */}
                  {!!c.actionKeys?.length && (
                    <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.subtext, lineHeight: 1.6 }}>
                      {c.actionKeys.slice(0, 4).map((k) => (
                        <li key={k}>{T.caseActions[k]}</li>
                      ))}
                    </ul>
                  )}

                  {/* Кнопки */}
                  <div style={{ display: "flex", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
                    <a
                      href={c.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: `1px solid ${COLORS.border}`,
                        textDecoration: "none",
                        color: COLORS.text,
                        background: COLORS.chip,
                        fontWeight: 600,
                      }}
                    >
                      {T.casesShop}
                    </a>

                    <button
                      onClick={() => setOpenLead(true)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "none",
                        background: COLORS.brand,
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {T.casesCTA}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
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
          style={{
            marginTop: 12,
            padding: isMobile ? "10px 14px" : "10px 16px",
            background: COLORS.brand,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {T.ctas.b2bCta}
        </button>
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
              <button
                onClick={copyWeChat}
                style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.chip, cursor: "pointer" }}
              >
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
        <div
          onClick={() => setOpenLead(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: isMobile ? 320 : 380,
              background: "#fff",
              borderRadius: 14,
              border: `1px solid ${COLORS.border}`,
              padding: 18,
              boxShadow: "0 12px 32px rgba(0,0,0,.18)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{T.formTitle}</div>
            <div style={{ display: "grid", gap: 10 }}>
              <input
                placeholder={T.formName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, outline: "none" }}
              />
              <input
                placeholder={T.formEmail}
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                type="email"
                style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, outline: "none" }}
              />
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
                    style: {
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: `1px solid ${COLORS.border}`,
                      outline: "none",
                      width: "100%",
                    },
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setOpenLead(false)}
                style={{ padding: "9px 12px", background: COLORS.chip, border: `1px solid ${COLORS.border}`, borderRadius: 10, cursor: "pointer" }}
              >
                {T.formCancel}
              </button>
              <button
                onClick={sendLead}
                style={{ padding: "9px 14px", background: COLORS.brand, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}
              >
                {T.formSend}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
