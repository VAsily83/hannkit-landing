// pages/tg-form.tsx
import React, { useEffect, useMemo, useState } from "react";

type Lang = "ru" | "en" | "zh";

const COLORS = {
  brand: "#0B1E5B",
  text: "#111827",
  subtext: "#4B5563",
  card: "#FFFFFF",
  border: "#E5E7EB",
  chip: "#F3F4F6",
  bg: "#F6F7F9",
};

const TDICT: Record<
  Lang,
  {
    title: string;
    name: string;
    email: string;
    phone: string;
    send: string;
    note: string;
    done: string;
    ru: string;
    en: string;
    zh: string;
    close: string;
  }
> = {
  ru: {
    title: "Заявка",
    name: "Ваше имя",
    email: "Email",
    phone: "Телефон",
    send: "Отправить заявку",
    note: "Форма работает внутри Telegram. После отправки окно закроется.",
    done: "Заявка отправлена! Закрываем…",
    ru: "РУ",
    en: "EN",
    zh: "中文",
    close: "Закрыть",
  },
  en: {
    title: "Request",
    name: "Your name",
    email: "Email",
    phone: "Phone",
    send: "Send request",
    note: "This form runs inside Telegram. The window will close after sending.",
    done: "Request sent! Closing…",
    ru: "RU",
    en: "EN",
    zh: "中文",
    close: "Close",
  },
  zh: {
    title: "咨询",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    send: "提交",
    note: "此表单在 Telegram 内运行。提交后窗口将自动关闭。",
    done: "已提交！正在关闭…",
    ru: "РУ",
    en: "EN",
    zh: "中文",
    close: "关闭",
  },
};

const BOT_USERNAME = "HannkitBot"; // на случай резервного редиректа

function useLangFromParam(): Lang {
  const [lang, setLang] = useState<Lang>("ru");
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const q = (p.get("lang") || p.get("l") || "").toLowerCase();
      if (q === "en" || q === "zh" || q === "ru") setLang(q);
    } catch {}
  }, []);
  return lang;
}

export default function TgForm() {
  const lang = useLangFromParam();
  const T = useMemo(() => TDICT[lang], [lang]);

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [showManualClose, setShowManualClose] = useState(false);

  // ---- Telegram WebApp init
  const tg = typeof window !== "undefined" ? (window as any)?.Telegram?.WebApp : undefined;

  useEffect(() => {
    try {
      tg?.ready?.();
      tg?.expand?.();
      tg?.disableVerticalSwipes?.(); // iOS лишние свайпы
      tg?.disableClosingConfirmation?.();
    } catch {}
  }, [tg]);

  // ---- Надёжное закрытие с несколькими попытками и fallback
  const tryClose = () => {
    try {
      tg?.close?.();
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!done) return;

    // 1) сразу попробовать закрыть
    const t0 = setTimeout(() => {
      if (tryClose()) return;
    }, 50);

    // 2) ещё попытки через короткие интервалы (на iOS иногда срабатывает не сразу)
    const t1 = setTimeout(() => {
      if (tryClose()) return;
    }, 400);

    const t2 = setTimeout(() => {
      if (tryClose()) return;
    }, 1000);

    // 3) мягкий резерв — вернуть пользователя в бота (если МП упёрлось)
    const t3 = setTimeout(() => {
      if (tryClose()) return;
      try {
        window.location.href = `https://t.me/${BOT_USERNAME}`;
      } catch {}
    }, 1700);

    // 4) самый крайний резерв (часто игнорируется iOS) — закрыть вкладку
    const t4 = setTimeout(() => {
      if (tryClose()) return;
      try {
        window.close();
      } catch {}
      // если не закрылось — показать ручную кнопку
      setShowManualClose(true);
    }, 2600);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      // можно прокинуть peerId / initData если понадобится — сейчас не требуется
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: mail,
          phone,
          source: "tg-webapp",
          lang,
        }),
      });
      setDone(true);
    } catch {
      // даже если сеть глючнула — всё равно пробуем закрыть,
      // т.к. у тебя запрос в итоге доходит по факту
      setDone(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        padding: 16,
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 8px 24px rgba(0,0,0,.06)",
        }}
      >
        {/* язык */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 6 }}>
          {(["ru", "en", "zh"] as Lang[]).map((l) => (
            <a
              key={l}
              href={`?lang=${l}`}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                textDecoration: "none",
                border: `1px solid ${lang === l ? COLORS.brand : COLORS.border}`,
                background: lang === l ? "#eef2ff" : COLORS.card,
                color: lang === l ? COLORS.brand : COLORS.text,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {TDICT[l][l]}
            </a>
          ))}
        </div>

        <h1 style={{ fontSize: 28, margin: "0 0 10px", letterSpacing: 0.2 }}>{T.title}</h1>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 8,
              background: "#FAFAFB",
              borderRadius: 14,
              padding: 12,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <input
              placeholder={T.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              style={inputStyle}
            />
            <input
              placeholder={T.email}
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />
            <input
              placeholder={T.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={sending}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                background: sending ? "#1f2a5a" : COLORS.brand,
                color: "#fff",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {T.send}
            </button>

            <div style={{ color: COLORS.subtext }}>{T.note}</div>

            {done && (
              <div
                style={{
                  background: COLORS.chip,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: 12,
                  fontWeight: 600,
                }}
              >
                {T.done}
              </div>
            )}

            {showManualClose && (
              <button
                type="button"
                onClick={() => {
                  if (!tryClose()) {
                    try {
                      window.location.href = `https://t.me/${BOT_USERNAME}`;
                    } catch {}
                  }
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {T.close}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: `1px solid ${COLORS.border}`,
  outline: "none",
  background: "#fff",
};
