// pages/index.tsx
import { useEffect, useMemo, useState } from "react";

type Lang = "ru" | "en" | "zh";

const TDICT = {
  ru: {
    brand: "Hannkit",
    langLabel: "Язык",
    ctas: { partner: "Стать партнёром" },
    heroTitle: "Продавайте в России без рисков и вложений",
    heroLead:
      "Мы размещаем ваши товары на Wildberries, Ozon и Яндекс.Маркете, берём на себя маркетинг, логистику и поддержку. Вы получаете себестоимость + 30% от прибыли после продажи.",
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
    email: "Email",
    telegramOpen: "Открыть в Telegram",
    wechatHint: "Откройте WeChat → Поиск → ID: HardVassya",
    footer: "© 2025 Hannkit · hannkit.com. All rights reserved.",
  },
  en: {
    brand: "Hannkit",
    langLabel: "Language",
    ctas: { partner: "Become a partner" },
    heroTitle: "Sell in Russia with no risk and upfront costs",
    heroLead:
      "We list your products on Wildberries, Ozon and Yandex.Market, handling marketing, logistics and support. You get cost price + 30% of profit after sale.",
    badges: ["Wildberries", "Ozon", "Yandex.Market"],
    whyTitle: "Why it benefits a manufacturer",
    why: [
      { title: "Fast launch", text: "Start selling with no investment or complex procedures" },
      { title: "Low risk", text: "We handle marketing, logistics and support" },
      { title: "Profit growth", text: "You get cost price + 30% of profit" },
    ],
    howTitle: "How we work",
    how: [
      "Demand & SKU analysis",
      "Legalization & certification",
      "Inbound to warehouse",
      "Marketplace sales",
      "Payouts & reports",
    ],
    finTitle: "Financial terms",
    fin: [
      "COGS+30% — standard compensation",
      "Monthly payouts",
      "We pay for marketing & logistics",
      "Transparent sales reports",
      "SLA on payout terms",
    ],
    trustTitle: "Guarantees & transparency",
    trust: [
      { title: "Legal compliance", text: "We work with legal entities and obey all regulations" },
      { title: "Transparent reports", text: "Regular dashboards and statistics" },
      { title: "Support 24/7", text: "We answer partners’ questions any time" },
    ],
    b2bTitle: "B2B for marketplace sellers",
    b2bLead: "Wholesale supply and solutions for active sellers.",
    b2b: [
      { title: "Wholesale", text: "Favourable terms from minimum order quantity" },
      { title: "White Label", text: "Produce under our label at your factory" },
      { title: "Trend analytics", text: "SKU & assortment recommendations based on data" },
      { title: "Logistics", text: "Delivery to marketplace warehouses with no involvement from you" },
    ],
    contactTitle: "Contact us",
    contactLead: "Get demand estimation and a test SKU matrix within 48 hours.",
    email: "Email",
    telegramOpen: "Open in Telegram",
    wechatHint: "Open WeChat → Search → ID: HardVassya",
    footer: "© 2025 Hannkit · hannkit.com. All rights reserved.",
  },
  zh: {
    brand: "Hannkit",
    langLabel: "语言",
    ctas: { partner: "成为合作伙伴" },
    heroTitle: "零风险、零前期投入在俄罗斯销售",
    heroLead:
      "我们在 Wildberries、Ozon 和 Yandex.Market 上架您的商品，并负责营销、物流与客服。售出后您获得成本价 + 30% 的利润。",
    badges: ["Wildberries", "Ozon", "Yandex.Market"],
    whyTitle: "对生产商的优势",
    why: [
      { title: "快速上线", text: "无需投入与复杂流程，即可启动销售" },
      { title: "风险极低", text: "我们承担营销、物流与客服" },
      { title: "利润提升", text: "售后获得成本 + 30% 利润" },
    ],
    howTitle: "我们的流程",
    how: ["需求与 SKU 分析", "合规与认证", "入仓", "平台销售", "结算与报表"],
    finTitle: "财务条款",
    fin: ["COGS+30% 标准分成", "按月结算", "营销与物流由我们承担", "透明的销售报表", "按 SLA 付款"],
    trustTitle: "保障与透明",
    trust: [
      { title: "合法合规", text: "与法人合作，遵守法规" },
      { title: "透明报表", text: "定期仪表盘与统计" },
      { title: "7×24 支持", text: "随时解答合作伙伴问题" },
    ],
    b2bTitle: "B2B（面向卖家）",
    b2bLead: "为平台卖家提供批发与解决方案。",
    b2b: [
      { title: "批发供货", text: "起订量低、价格优惠" },
      { title: "白标生产", text: "在您工厂贴我们品牌生产" },
      { title: "趋势分析", text: "基于数据的 SKU 与选品建议" },
      { title: "一件入仓", text: "直送平台仓，无需您操心" },
    ],
    contactTitle: "联系我们",
    contactLead: "48 小时内提供需求评估与测试 SKU 矩阵。",
    email: "邮箱",
    telegramOpen: "打开 Telegram",
    wechatHint: "打开 WeChat → 搜索 → ID: HardVassya",
    footer: "© 2025 Hannkit · hannkit.com. All rights reserved.",
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "ru" || saved === "en" || saved === "zh") setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const T = useMemo(() => TDICT[lang], [lang]);

  const mailto = (name?: string, email?: string, phone?: string) => {
    const subject = "Заявка с лендинга Hannkit";
    const body = `Имя/Name: ${name || "-"}\nEmail: ${email || "-"}\nТел/Phone: ${phone || "-"}`;
    return `mailto:Wildbizshop@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", color: "#0f172a" }}>
      {/* NAVBAR */}
      <div style={{ background: "#0B1E5B", color: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <strong>Hannkit</strong>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ opacity: 0.8 }}>{T.langLabel}:</span>
            {(["ru", "en", "zh"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: lang === l ? "#fff" : "transparent",
                  color: lang === l ? "#0B1E5B" : "#fff",
                  cursor: "pointer",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HERO */}
      <header style={{ background: "#0B1E5B", color: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 20px" }}>
          <h1 style={{ fontSize: 44, lineHeight: 1.1, margin: 0 }}>{T.heroTitle}</h1>
          <p style={{ marginTop: 16, opacity: 0.95, maxWidth: 900 }}>{T.heroLead}</p>
          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={mailto()} style={{ background: "#fff", color: "#0B1E5B", borderRadius: 10, padding: "12px 18px", fontWeight: 600, textDecoration: "none" }}>
              {T.ctas.partner}
            </a>
            {T.badges.map((b, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", padding: "8px 14px", borderRadius: 999 }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main style={{ background: "#F6F7FB" }}>
        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 20px" }}>
          <h2 style={{ fontSize: 28, margin: "16px 0 20px" }}>{T.whyTitle}</h2>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
            {T.why.map((card, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
                <strong>{card.title}</strong>
                <div style={{ marginTop: 8, opacity: 0.9 }}>{card.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 20px 28px" }}>
          <h2 style={{ fontSize: 28, margin: "12px 0 14px" }}>{T.howTitle}</h2>
          <ul style={{ lineHeight: 1.8 }}>
            {T.how.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 20px 28px" }}>
          <h2 style={{ fontSize: 28, margin: "12px 0 14px" }}>{T.finTitle}</h2>
          <ul style={{ lineHeight: 1.8 }}>
            {T.fin.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 20px 28px" }}>
          <h2 style={{ fontSize: 28, margin: "12px 0 14px" }}>{T.trustTitle}</h2>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
            {T.trust.map((card, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
                <strong>{card.title}</strong>
                <div style={{ marginTop: 8, opacity: 0.9 }}>{card.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 20px 40px" }}>
          <h2 style={{ fontSize: 28, margin: "12px 0 8px" }}>{T.b2bTitle}</h2>
          <div style={{ opacity: 0.9, marginBottom: 16 }}>{T.b2bLead}</div>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
            {T.b2b.map((card, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
                <strong>{card.title}</strong>
                <div style={{ marginTop: 8, opacity: 0.9 }}>{card.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <a href={mailto()} style={{ background: "#0B1E5B", color: "#fff", borderRadius: 10, padding: "12px 18px", fontWeight: 600, textDecoration: "none" }}>
              {T.ctas.partner}
            </a>
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 20px 64px" }}>
          <h2 style={{ fontSize: 28, margin: "12px 0 14px" }}>{T.contactTitle}</h2>
          <div style={{ opacity: 0.9, marginBottom: 16 }}>{T.contactLead}</div>

          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{T.email}</div>
              <a href={mailto()} style={{ color: "#0B1E5B", fontWeight: 600, textDecoration: "none" }}>
                Wildbizshop@gmail.com
              </a>
              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}>Если почтовый клиент не открылся — попробуйте в обычной вкладке</div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Telegram</div>
              <a href="https://t.me/HardVassya" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#229ED9", color: "#fff", padding: "10px 14px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
                @HardVassya — {T.telegramOpen}
              </a>
              <div style={{ marginTop: 14, fontWeight: 600 }}>WeChat</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>{T.wechatHint}</div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: "#EEF0F4", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 20px", opacity: 0.8 }}>{T.footer}</div>
      </footer>
    </div>
  );
}
