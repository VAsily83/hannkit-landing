import React, { useEffect, useMemo, useState } from "react";
import PhoneInput from "react-phone-number-input";

type Lang = "ru" | "en" | "zh";

const T: Record<Lang, any> = {
  ru: {
    title: "Заявка",
    lead: "Оставьте контакты — ответим в Telegram или на почту.",
    name: "Имя",
    email: "Email",
    phone: "Телефон",
    send: "Отправить заявку",
    hint: "Форма работает внутри Telegram. После отправки окно закроется.",
    sent: "Заявка отправлена! Закрываем…",
    err: "Не удалось отправить. Попробуйте ещё раз.",
    ru: "РУ", en: "EN", zh: "中文",
  },
  en: {
    title: "Request",
    lead: "Leave your contacts — we’ll reply in Telegram or by email.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    send: "Send request",
    hint: "The form runs inside Telegram. The window will close after sending.",
    sent: "Request sent! Closing…",
    err: "Failed to send. Please try again.",
    ru: "RU", en: "EN", zh: "中文",
  },
  zh: {
    title: "咨询",
    lead: "留下联系方式，我们会在 Telegram 或邮箱回复。",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    send: "提交",
    hint: "表单在 Telegram 内运行，提交后会自动关闭。",
    sent: "已提交！正在关闭…",
    err: "提交失败，请重试。",
    ru: "俄", en: "英", zh: "中",
  },
};

const BOT_LINK = "https://t.me/HannkitBot";
const API_URL = "/api/lead";

function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ru";
    const url = new URL(window.location.href);
    const q = (url.searchParams.get("lang") || "ru") as Lang;
    return (["ru", "en", "zh"] as Lang[]).includes(q) ? q : "ru";
  });
  return [lang, setLang];
}

export default function TgFormPage() {
  const [lang, setLang] = useLang();
  const TT = useMemo(() => T[lang], [lang]);

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState<string | undefined>("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const WebApp: any =
    typeof window !== "undefined" ? (window as any).Telegram?.WebApp : null;

  const inTelegram = !!WebApp && !!WebApp.initData;

  // ---- init Telegram WebApp ----
  useEffect(() => {
    if (!WebApp) return;
    try {
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor("secondary_bg_color");
      WebApp.setBackgroundColor("secondary_bg_color");
      WebApp.enableClosingConfirmation(false);
    } catch {}
  }, [WebApp]);

  async function submit() {
    if (busy) return;
    setBusy(true);
    setMsg("");

    const payload = {
      name,
      email: mail,
      phone,
      source: "telegram-miniapp",
      lang,
    };

    try {
      const r = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) throw new Error("bad response");

      // success UX
      try {
        WebApp?.HapticFeedback?.notificationOccurred?.("success");
      } catch {}

      setMsg(TT.sent);

      // ---- robust close chain (iOS safe) ----
      const tryClose = () => {
        try { WebApp?.close(); } catch {}
        try { (window as any).close?.(); } catch {}
      };

      // 1) softly jump to bot chat (exits webview on iOS), then close
      setTimeout(() => {
        try { WebApp?.openTelegramLink?.(BOT_LINK); } catch {}
        tryClose();
      }, 350);

      // 2) second attempt
      setTimeout(tryClose, 900);

      // 3) last-resort fallback if still in Safari/standalone webview
      setTimeout(() => {
        if (document.visibilityState !== "hidden") {
          // not closed — navigate away so user is not stuck on blank webview
          window.location.replace(BOT_LINK);
        }
      }, 1500);
    } catch {
      setMsg(TT.err);
      try {
        WebApp?.HapticFeedback?.notificationOccurred?.("error");
      } catch {}
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
        background: "#0b1e5b0d",
        minHeight: "100vh",
        padding: 16,
        color: "#0B1E5B",
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #E5E7EB",
          boxShadow: "0 10px 30px rgba(0,0,0,.06)",
          padding: 18,
        }}
      >
        {/* Lang switch */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {(["ru", "en", "zh"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              disabled={busy}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border:
                  l === lang ? "1px solid #0B1E5B" : "1px solid rgba(0,0,0,.15)",
                background: l === lang ? "#0B1E5B" : "#fff",
                color: l === lang ? "#fff" : "#0B1E5B",
                cursor: "pointer",
              }}
            >
              {T[l]}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: 34, margin: "6px 0 10px" }}>{TT.title}</h1>
        <p style={{ color: "#374151", marginTop: 0 }}>{TT.lead}</p>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            placeholder={TT.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              outline: "none",
            }}
          />

          <input
            placeholder={TT.email}
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            type="email"
            disabled={busy}
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              outline: "none",
            }}
          />

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#6B7280" }}>{TT.phone}</label>
            <PhoneInput
              defaultCountry="RU"
              international
              countryCallingCodeEditable={true}
              value={phone}
              onChange={setPhone}
              placeholder="+7 900 000-00-00"
              numberInputProps={{
                style: {
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  outline: "none",
                  width: "100%",
                },
              }}
              disabled={busy}
            />
          </div>

          <button
            onClick={submit}
            disabled={busy}
            style={{
              marginTop: 8,
              padding: "14px 16px",
              background: busy ? "#334155" : "#0B1E5B",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              fontWeight: 700,
              cursor: busy ? "default" : "pointer",
            }}
          >
            {TT.send}
          </button>

          <div style={{ color: "#374151" }}>{TT.hint}</div>

          {!!msg && (
            <div
              style={{
                marginTop: 6,
                background: "#F3F4F6",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "12px 14px",
                color: msg === TT.err ? "#B91C1C" : "#111827",
              }}
            >
              {msg}
            </div>
          )}

          {/* если НЕ в Telegram, сразу уводим пользователя в чат после отправки */}
          {!inTelegram && (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              Открыто не в Telegram. После отправки выполнится переход в{" "}
              <a href={BOT_LINK}>чат бота</a>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
