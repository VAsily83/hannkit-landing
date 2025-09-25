// pages/tg-form.tsx
import { useEffect, useMemo, useState } from "react";

const COLORS = { brand: "#0B1E5B", border: "#E5E7EB", subtext: "#374151" };

type Lang = "ru" | "en" | "zh";
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
    need: string;
    ok: string;
    fail: string;
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
    need: "Укажите имя и хотя бы email или телефон.",
    ok: "Заявка отправлена!",
    fail: "Не удалось отправить. Попробуйте ещё раз.",
  },
  en: {
    title: "Request",
    lead: "Leave your contacts — we’ll reply via Telegram or email.",
    name: "Your name",
    email: "Email",
    phone: "Phone",
    send: "Send request",
    sending: "Sending…",
    hint: "This form runs inside Telegram. It will close after submission.",
    need: "Please provide your name and either email or phone.",
    ok: "Request sent!",
    fail: "Failed to send. Please try again.",
  },
  zh: {
    title: "提交申请",
    lead: "留下联系方式，我们会通过 Telegram 或邮箱回复。",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    send: "提交申请",
    sending: "正在提交…",
    hint: "此表单在 Telegram 内运行，提交后会自动关闭。",
    need: "请填写姓名，并提供邮箱或电话其中之一。",
    ok: "已发送！",
    fail: "发送失败，请重试。",
  },
};

// --- Telegram WebApp typings (минимально нужные) ---
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        expand?: () => void;
        close?: () => void;
        sendData?: (data: string) => void;
        enableClosingConfirmation?: (v: boolean) => void;
        HapticFeedback?: {
          notificationOccurred?: (t: "success" | "warning" | "error") => void;
        };
        themeParams?: Record<string, string>;
        MainButton?: {
          setText?: (t: string) => void;
          show?: () => void;
          hide?: () => void;
          isVisible?: boolean;
        };
        onEvent?: (event: string, cb: (...a: any[]) => void) => void;
        offEvent?: (event: string, cb: (...a: any[]) => void) => void;
        initDataUnsafe?: { user?: { language_code?: string } };
      };
    };
  }
}

// --- helpers ---
function pickLangFromTG(code?: string): Lang {
  const c = (code || "").toLowerCase();
  if (c.startsWith("zh")) return "zh";
  if (c.startsWith("en")) return "en";
  return "ru";
}
function pickInitialLang(): Lang {
  if (typeof window !== "undefined") {
    try {
      const q = new URLSearchParams(window.location.search);
      const ql = (q.get("lang") || "").toLowerCase() as Lang;
      if (ql === "ru" || ql === "en" || ql === "zh") return ql;
      const tg = window.Telegram?.WebApp;
      const lc = tg?.initDataUnsafe?.user?.language_code;
      return pickLangFromTG(lc);
    } catch {}
  }
  return "ru";
}

export default function TgForm() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [lang, setLang] = useState<Lang>(pickInitialLang());
  const [sending, setSending] = useState(false);

  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
  const inTG = !!tg;

  // тема из Telegram + наши дефолты
  const theme = useMemo(() => {
    const t = tg?.themeParams || {};
    return {
      bg: t.bg_color || "#ffffff",
      text: t.text_color || "#111827",
      subtext: t.hint_color || COLORS.subtext,
      brand: COLORS.brand,
      border: COLORS.border,
    };
  }, [tg?.themeParams]);

  // Инициализация WebApp
  useEffect(() => {
    if (!tg) return;
    try {
      tg.ready?.();
      tg.expand?.();
      tg.enableClosingConfirmation?.(false);
      tg.MainButton?.setText?.(T[lang].send);
      tg.MainButton?.show?.();
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tg, lang]);

  // Обработчик MainButton (через onEvent — стабильнее для iOS)
  useEffect(() => {
    if (!tg?.onEvent) return;
    const handler = async () => {
      if (!sending) await submit();
    };
    tg.onEvent("mainButtonClicked", handler);
    return () => tg.offEvent?.("mainButtonClicked", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, mail, phone, lang, sending]);

  // Унифицированное закрытие (с фоллбэками под iOS)
  const closeWebApp = () => {
    try {
      tg?.sendData?.("submitted"); // не мешает, иногда помогает iOS корректно «закрыться»
    } catch {}
    // небольшая задержка чтобы Telegram успел обработать sendData
    setTimeout(() => {
      try {
        tg?.close?.();
      } catch {}
      // Fallback-цепочка (если вдруг не закрылось)
      setTimeout(() => {
        try {
          window.close();
        } catch {}
        setTimeout(() => {
          try {
            history.length > 1 ? history.back() : (window.location.href = "about:blank");
          } catch {
            try {
              window.location.replace("about:blank");
            } catch {}
          }
        }, 200);
      }, 100);
    }, 50);
  };

  const submit = async () => {
    if (!name || !(mail || phone)) {
      alert(T[lang].need);
      return;
    }
    setSending(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: mail,
          phone,
          lang,
          source: "telegram-webapp",
        }),
      });

      if (r.ok) {
        tg?.HapticFeedback?.notificationOccurred?.("success");
        // прячем MainButton на всякий
        tg?.MainButton?.hide?.();
        closeWebApp();
        return;
      }
      throw new Error("bad status");
    } catch {
      tg?.HapticFeedback?.notificationOccurred?.("error");
      alert(T[lang].fail);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: "2px 0 10px" }}>
            {T[lang].title}
          </h1>
          <div style={{ display: "flex", gap: 6 }}>
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
                {l === "zh" ? "中文" : l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <p style={{ color: theme.subtext, margin: "0 0 14px" }}>{T[lang].lead}</p>

        <div
          style={{
            display: "grid",
            gap: 10,
            background: "#fff",
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: 12,
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
            }}
          />
          <input
            placeholder={T[lang].email}
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              outline: "none",
            }}
          />
          <input
            placeholder={T[lang].phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              outline: "none",
            }}
          />

          {/* Если открыто не в Telegram WebApp — рендерим нашу кнопку */}
          {!inTG && (
            <button
              onClick={submit}
              disabled={sending}
              style={{
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: theme.brand,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {sending ? T[lang].sending : T[lang].send}
            </button>
          )}
        </div>

        <div style={{ fontSize: 12, color: theme.subtext, marginTop: 10 }}>
          {T[lang].hint}
        </div>
      </div>
    </div>
  );
}
