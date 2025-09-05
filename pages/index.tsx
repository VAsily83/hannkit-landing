import React, { useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
    heroLead: "我们将您的产品上架至 Wildberries、Ozon 与 Yandex.Market，并负责营销、物流与支持。售出后您获得成本价 + 30% 的利润。",
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

function getBadgeStyle(label: string) {
  const l = label.toLowerCase();
  // Бренд-цвета
  const wb = "#A100FF";
  const ozon = "#005BFF";
  const ym = "#FFD633";

  if (l.includes("wildberries")) {
    return { bg: wb, color: "#fff" };
  }
  if (l.includes("ozon")) {
    return { bg: ozon, color: "#fff" };
  }
  if (l.includes("market")) {
    return { bg: ym, color: "#111" };
  }
  return { bg: "rgba(255,255,255,.12)", color: "#fff" };
}

export default function Landing() {
  const [lang, setLang] = useState<Lang>("ru");
  const T = useMemo(() => TDICT[lang], [lang]);

  const [openLead, setOpenLead] = useState(false);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState<string | undefined>();

  const contactRef = useRef<HTMLDivElement>(null);
  const openModal = () => setOpenLead(true);

  const FORMSPREE = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  const sendLead = async () => {
    const fullPhone = phone || "";

    if (FORMSPREE) {
      try {
        const r = await fetch(FORMSPREE, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email: mail, phone: fullPhone, source: "hannkit.com", lang }),
        });
        if (r.ok) {
          alert(T.toastOk);
          setOpenLead(false);
          setName("");
          setMail("");
          setPhone("");
          return;
        }
      } catch (e) {
        // fallback ниже
      }
    }

    alert(T.toastFail);
    const subject = T.mailSubject;
    const body =
      `${T.formName}: ${name || "-"}\n` +
      `${T.formEmail}: ${mail || "-"}\n` +
      `${T.formPhone}: ${fullPhone || "-"}`;
    const href = `mailto:Wildbizshop@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
      {/* Header */}
      <header style={{ background: COLORS.brand, color: "#fff", position: "sticky", top: 0, zIndex: 20, borderBottom: `1px solid ${COLORS.brandSoft}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 22 }}>{T.brand}</div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ opacity: 0.85, marginRight: 6 }}>{T.langLabel}:</span>
            {(["ru", "en", "zh"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${l === lang ? "#fff" : "rgba(255,255,255,.35)"}`,
                  background: l === lang ? "#fff" : "transparent",
                  color: l === lang ? COLORS.brand : "#fff",
                  cursor: "pointer",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
            <button
              onClick={openModal}
              style={{ marginLeft: 12, padding: "8px 14px", background: "#fff", color: COLORS.brand, border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}
            >
              {T.ctas.partner}
            </button>
          </div>
        </div>
      </header>

      {/* Hero (без дублирования карточек) */}
      <section style={{ background: COLORS.brand, color: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "38px 20px 34px" }}>
          <h1 style={{ fontSize: 44, lineHeight: 1.15, letterSpacing: 0.2, margin: "0 0 14px" }}>{T.heroTitle}</h1>
          <p style={{ maxWidth: 840, fontSize: 18, lineHeight: 1.6, opacity: 0.95 }}>{T.heroLead}</p>

          <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={openModal}
              style={{ padding: "10px 16px", background: "#fff", color: COLORS.brand, border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
            >
              {T.ctas.partner}
            </button>

            {T.badges.map((b, i) => {
              const { bg, color } = getBadgeStyle(b);
              return (
                <span
                  key={i}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: bg,
                    color,
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,.12)",
                  }}
                >
                  {b}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why — один раз */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "36px 20px 6px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 16px" }}>{T.whyTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {T.why.map((card, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{card.title}</div>
              <div style={{ color: COLORS.subtext }}>{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 20px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.howTitle}</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: COLORS.subtext, margin: 0 }}>
          {T.how.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      </section>

      {/* Financials */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 20px 24px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.finTitle}</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: COLORS.subtext, margin: 0 }}>
          {T.fin.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      </section>

      {/* Trust */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "10px 20px 24px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 16px" }}>{T.trustTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {T.trust.map((card, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{card.title}</div>
              <div style={{ color: COLORS.subtext }}>{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "10px 20px 28px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>{T.catsTitle}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {T.cats.map((c, i) => (
            <span key={i} style={{ background: COLORS.chip, border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "8px 12px" }}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* B2B */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "6px 20px 34px" }}>
        <h2 style={{ fontSize: 26, margin: "0 0 6px" }}>{T.b2bTitle}</h2>
        <p style={{ color: COLORS.subtext, margin: "0 0 14px" }}>{T.b2bLead}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {T.b2b.map((b, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{b.title}</div>
              <div style={{ color: COLORS.subtext }}>{b.text}</div>
            </div>
          ))}
        </div>
        <button
          onClick={openModal}
          style={{ marginTop: 12, padding: "10px 16px", background: COLORS.brand, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer" }}
        >
          {T.ctas.b2bCta}
        </button>
      </section>

      {/* Contacts */}
      <section ref={contactRef} style={{ background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "22px 20px 36px" }}>
          <h2 style={{ fontSize: 26, margin: "0 0 6px" }}>{T.contactTitle}</h2>
          <p style={{ color: COLORS.subtext, margin: "0 0 14px" }}>{T.contactLead}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
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
            style={{ width: 380, background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 18, boxShadow: "0 12px 32px rgba(0,0,0,.18)" }}
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
              <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "6px 10px" }}>
                <PhoneInput
                  international
                  defaultCountry={lang === "ru" ? "RU" : lang === "zh" ? "CN" : "US"}
                  value={phone}
                  onChange={setPhone}
                  placeholder={T.formPhone}
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
