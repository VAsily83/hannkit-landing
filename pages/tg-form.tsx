// pages/tg-form.tsx
import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        themeParams?: Record<string, string>;
        initDataUnsafe?: { user?: { id?: number; username?: string; first_name?: string; last_name?: string } };
        colorScheme?: "light" | "dark";
        HapticFeedback?: { impactOccurred: (style: "light" | "medium" | "heavy") => void };
      };
    };
  }
}

type Lang = "ru" | "en" | "zh";

const COLORS = { brand: "#0B1E5B", border: "#E5E7EB", subtext: "#374151", bg: "#F6F7F9", card: "#fff" };

const T: Record<
  Lang,
  {
    title: string;
    lead: string;
    name: string;
    email: string;
    phone: string;
    send: string;
    sending: string;
    hint: string;
    sent: string;
    ru: string;
    en: string;
    zh: string;
  }
> = {
  ru: {
    title: "Заявка",
    lead: "Оставьте контакты — ответим в Telegram или на почту.",
    name: "Ваше имя",
    email: "Email",
    phone: "Телефон",
    send: "Отправить заявку",
    sending: "Отправляем…",
    hint: "Форма работает внутри Telegram. После отправки окно закроется.",
    sent: "Заявка отправлена! Закрываем…",
    ru: "РУ",
    en: "EN",
    zh: "中文",
  },
  en: {
    title: "Request",
    lead: "Leave your contacts — we’ll reply in Telegram or by email.",
    name: "Your name",
    email: "Email",
    phone: "Phone",
    send: "Send request",
    sending: "Sending…",
    hint: "The form runs inside Telegram. After sending, the window will close.",
    sent: "Sent! Closing…",
    ru: "RU",
    en: "EN",
    zh: "中文",
  },
  zh: {
    title: "咨询",
    lead: "留下联系方式 — 我们会在 Telegram 或邮箱回复。",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    send: "提交",
    sending: "发送中…",
    hint: "表单在 Telegram 内运行。提交后窗口将关闭。",
    sent: "已发送！正在关闭…",
    ru: "俄",
    en: "英",
    zh: "中",
  },
};

// безопасно определяем язык (без доступа к window при SSR)
const pickInitialLang = (): Lang => "ru";

export default function TgFormPage() {
  const [lang, setLang] = useState<Lang>(pickInitialLang());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const tgRef = useRef<NonNullable<typeof window.Telegram>["WebApp"] | null>(null);

  // Инициализация Telegram WebApp только на клиенте
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tg = window.Telegram?.WebApp ?? null;
    tgRef.current = tg || null;

    try {
      tg?.ready();
      tg?.expand();
    } catch {}
  }, []);

  // аккуратный выбор языка из query (только на клиенте)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const ql = (qs.get("lang") || qs.get("l") || "").toLowerCase();
    if (ql === "ru" || ql === "en" || ql === "zh") setLang(ql as Lang);
  }, []);

  const theme = useMemo(() => {
    const tp = tgRef.current?.themeParams || {};
    const bg = tp.bg_color || COLORS.bg;
    const card = "#ffffff";
    const text = tp.text_color || "#111827";
    const subtext = tp.hint_color || COLORS.subtext;
    const brand = tp.button_color || COLORS.brand;
    const border = COLORS.border;
    return { bg, card, text, subtext, brand, border };
  }, [tgRef.current?.themeParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Универсальное закрытие окна (iOS-хаки внутри)
  const closeMiniApp = () => {
    const tg = tgRef.current;
    let closed = false;

    try {
      tg?.HapticFeedback?.impactOccurred("light");
    } catch {}

    try {
      tg?.close?.();
      closed = true;
    } catch {}

    const tryHardClose = () => {
      if (typeof window === "undefined") return;
      try {
        // 1) назад в контроллере
        if (window.history.length > 1) {
          window.history.back();
          closed = true;
        }
      } catch {}

      try {
        // 2) выгрузить вкладку
        window.location.href = "about:blank";
        closed = true;
      } catch {}

      try {
        // 3) iOS WebView костыль
        // @ts-ignore
        window.open("", "_self");
        window.close();
        closed = true;
      } catch {}
    };

    // даже если close() сработал — подстрахуемся
    setTimeout(tryHardClose, 50);
    setTimeout(tryHardClose, 300);
  };

  const submit = async () => {
    if (sending) return;
    setSending(true);

    const payload = {
      name,
      email,
      phone,
      lang,
      source: "tg-miniapp",
      tg: {
        user: tgRef.current?.initDataUnsafe?.user || null,
      },
    };

    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (r.ok) {
        setSent(true);
        // показываем "отправлено" и закрываем
        setTimeout(closeMiniApp, 300);
        return;
      }
    } catch {
      // игнор
    } finally {
      // не держим состояние "sending" если закрытие не удалось
      setTimeout(() => setSending(false), 500);
    }

    // если API вернуло не 200 — всё равно пытаемся закрыть
    setSent(true);
    setTimeout(closeMiniApp, 300);
  };

  return (
    <div
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
        background: theme.bg,
        color: theme.text,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "18px 16px 24px" }}>
        {/* Lang switch */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {(["ru", "en", "zh"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: `1px solid ${l === lang ? theme.brand : theme.border}`,
                background: l === lang ? theme.brand : "transparent",
                color: l === lang ? "#fff" : theme.text,
                cursor: "pointer",
              }}
            >
              {T[lang][l]}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "10px 0 10px" }}>{T[lang].title}</h1>
        <p style={{ color: theme.subtext, margin: 0 }}>{T[lang].lead}</p>

        <div
          style={{
            marginTop: 14,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 14,
            padding: 14,
            display: "grid",
            gap: 10,
          }}
        >
          <input
            placeholder={T[lang].name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              outline: "none",
              width: "100%",
              background: "#fff",
            }}
          />
          <input
            placeholder={T[lang].email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            style={{
              padding: "12px",
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              outline: "none",
              width: "100%",
              background: "#fff",
            }}
          />
          <input
            placeholder={T[lang].phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            style={{
              padding: "12px",
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              outline: "none",
              width: "100%",
              background: "#fff",
            }}
          />

          <button
            onClick={submit}
            disabled={sending}
            style={{
              padding: "12px",
              borderRadius: 10,
              border: "none",
              background: sending ? theme.subtext : theme.brand,
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {sending ? T[lang].sending : T[lang].send}
          </button>

          <div style={{ fontSize: 12, color: theme.subtext }}>{T[lang].hint}</div>

          {sent && (
            <div
              role="status"
              aria-live="polite"
              style={{
                marginTop: 6,
                padding: "10px 12px",
                borderRadius: 10,
                background: "#F3F4F6",
                border: `1px solid ${theme.border}`,
                color: theme.text,
              }}
            >
              {T[lang].sent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
