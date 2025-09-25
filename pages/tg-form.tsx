// pages/tg-form.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";

type Lang = "ru" | "en" | "zh";

const COLORS = {
  brand: "#0B1E5B",
  text: "#111827",
  subtext: "#374151",
  border: "#E5E7EB",
  chip: "#F3F4F6",
  card: "#FFFFFF",
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
    ok: string;
    fail: string;
    hint: string;
    ru: string;
    en: string;
    zh: string;
  }
> = {
  ru: {
    title: "Оставьте контакты — ответим в Telegram или на почту.",
    name: "Ваше имя",
    email: "Email",
    phone: "Телефон",
    send: "Отправить заявку",
    ok: "Заявка отправлена! Закрываем…",
    fail: "Не удалось отправить. Попробуйте ещё раз.",
    hint: "Форма работает внутри Telegram. После отправки окно закроется.",
    ru: "РУ",
    en: "EN",
    zh: "中文",
  },
  en: {
    title: "Leave your contacts — we’ll reply in Telegram or email.",
    name: "Your name",
    email: "Email",
    phone: "Phone",
    send: "Send request",
    ok: "Sent! Closing…",
    fail: "Failed to send. Try again.",
    hint: "The form runs inside Telegram. The window will close after sending.",
    ru: "RU",
    en: "EN",
    zh: "中文",
  },
  zh: {
    title: "留下联系方式——我们会在 Telegram 或邮箱回复。",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    send: "提交",
    ok: "已发送！即将关闭…",
    fail: "发送失败，请重试。",
    hint: "表单在 Telegram 内运行，发送后窗口会关闭。",
    ru: "РУ",
    en: "EN",
    zh: "中文",
  },
};

// --- helpers
const getTG = () => (typeof window !== "undefined" ? (window as any)?.Telegram?.WebApp : undefined);

export default function TGForm() {
  const [lang, setLang] = useState<Lang>("ru");
  const T = useMemo(() => TDICT[lang], [lang]);

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState<string | undefined>();

  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // init Telegram WebApp
  useEffect(() => {
    const tg = getTG();
    try {
      tg?.ready();
      tg?.expand();
      tg?.setHeaderColor?.("#ffffff");
      tg?.setBackgroundColor?.("#ffffff");
    } catch {}
  }, []);

  // language from tg initData (if you хотите)
  useEffect(() => {
    const tg = getTG();
    const uiLang = tg?.initDataUnsafe?.user?.language_code as string | undefined;
    if (uiLang) {
      if (uiLang.startsWith("ru")) setLang("ru");
      else if (uiLang.startsWith("zh")) setLang("zh");
      else setLang("en");
    }
  }, []);

  const closeWebAppSafely = () => {
    const tg = getTG();
    try { tg?.HapticFeedback?.notificationOccurred?.("success"); } catch {}

    let closed = false;

    const tryClose = () => {
      try {
        if (tg && typeof tg.close === "function") {
          tg.close();
          closed = true;
        }
      } catch {}
    };

    // попытка №1
    tryClose();

    // если Telegram на iOS «очистил» webview, но не закрыл — даём короткую паузу и пытаемся ещё раз
    if (!closed) {
      setTimeout(() => {
        tryClose();
        // финальные фолбэки
        if (!closed && typeof window !== "undefined") {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            // последний шанс: уводим пользователя к боту
            window.location.replace("https://t.me/HannkitBot");
          }
        }
      }, 120);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setMsg(null);

    // подчистим UI (избежать "белого листа" на iOS при резком закрытии)
    const root = document.getElementById("__next") || document.body;
    root.style.pointerEvents = "none";

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email: mail,
          phone,
          source: "tg-form",
          lang,
        }),
      });

      if (res.ok) {
        setMsg(T.ok);
        // короткая пауза, чтобы текст "успех" успел показаться, и закрываем
        setTimeout(closeWebAppSafely, 80);
      } else {
        throw new Error(String(res.status));
      }
    } catch {
      setMsg(T.fail);
      // вернём интерактивность, чтобы можно было повторить
      const root2 = document.getElementById("__next") || document.body;
      root2.style.pointerEvents = "auto";
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        color: COLORS.text,
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 28px" }}>
        {/* Tabs (lang) */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {(["ru", "en", "zh"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              disabled={sending}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: `1px solid ${l === lang ? COLORS.brand : COLORS.border}`,
                background: l === lang ? COLORS.brand : "#fff",
                color: l === lang ? "#fff" : COLORS.text,
                cursor: "pointer",
              }}
            >
              {TDICT[l][l]}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: 28, margin: "10px 0 14px", lineHeight: 1.2 }}>Заявка</h1>
        <p style={{ color: COLORS.subtext, margin: "0 0 16px" }}>{T.title}</p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            placeholder={T.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={sending}
            style={{
              width: "100%",
              padding: "14px 12px",
              borderRadius: 14,
              border: `1px solid ${COLORS.border}`,
              outline: "none",
              fontSize: 16,
            }}
          />
          <input
            placeholder={T.email}
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            disabled={sending}
            type="email"
            style={{
              width: "100%",
              padding: "14px 12px",
              borderRadius: 14,
              border: `1px solid ${COLORS.border}`,
              outline: "none",
              fontSize: 16,
            }}
          />
          <div>
            <PhoneInput
              defaultCountry="RU"
              international
              countryCallingCodeEditable={true}
              value={phone}
              onChange={setPhone}
              placeholder="+7 900 000-00-00"
              numberInputProps={{
                style: {
                  width: "100%",
                  padding: "14px 12px",
                  borderRadius: 14,
                  border: `1px solid ${COLORS.border}`,
                  outline: "none",
                  fontSize: 16,
                },
              }}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            style={{
              marginTop: 6,
              padding: "14px 16px",
              borderRadius: 14,
              border: "none",
              background: COLORS.brand,
              color: "#fff",
              fontWeight: 700,
              cursor: sending ? "default" : "pointer",
              opacity: sending ? 0.7 : 1,
            }}
          >
            {T.send}
          </button>

          <p style={{ color: COLORS.subtext, margin: "8px 2px 0", fontSize: 14 }}>{T.hint}</p>
          {msg && (
            <div
              role="status"
              style={{
                marginTop: 8,
                padding: "10px 12px",
                borderRadius: 12,
                background: COLORS.chip,
                border: `1px solid ${COLORS.border}`,
                fontSize: 14,
              }}
            >
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
