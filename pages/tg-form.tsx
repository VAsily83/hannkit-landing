// pages/tg-form.tsx
import React, { useEffect, useMemo, useState } from "react";
import Script from "next/script";

type Lang = "ru" | "en" | "zh";

const COLORS = {
  brand: "#0B1E5B",
  text: "#0F172A",
  subtext: "#475569",
  border: "#E5E7EB",
  chip: "#F3F4F6",
  card: "#FFFFFF",
  bg: "#F8FAFC",
};

const TDICT: Record<
  Lang,
  { title: string; name: string; email: string; phone: string; send: string; hint: string; sent: string; close: string; langRU: string; langEN: string; langZH: string }
> = {
  ru: { title: "Заявка", name: "Ваше имя", email: "Email", phone: "Телефон", send: "Отправить заявку", hint: "Форма работает внутри Telegram. После отправки окно закроется (или нажмите «Закрыть»).", sent: "Заявка отправлена! Закрываем…", close: "Закрыть", langRU: "РУ", langEN: "EN", langZH: "中文" },
  en: { title: "Request", name: "Your name", email: "Email", phone: "Phone", send: "Send request", hint: "This form runs inside Telegram. After sending, the window will close (or tap “Close”).", sent: "Request sent! Closing…", close: "Close", langRU: "RU", langEN: "EN", langZH: "ZH" },
  zh: { title: "提交信息", name: "姓名", email: "邮箱", phone: "电话", send: "提交", hint: "该表单在 Telegram 内运行。提交后窗口会关闭（或点击“关闭”）。", sent: "已提交！正在关闭…", close: "关闭", langRU: "俄", langEN: "英", langZH: "中" },
};

function getTG() {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.Telegram && w.Telegram.WebApp ? (w.Telegram.WebApp as any) : null;
}

export default function TgFormPage() {
  // язык из ?lang=
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ru";
    const url = new URL(window.location.href);
    const q = (url.searchParams.get("lang") || "").toLowerCase();
    return (["ru", "en", "zh"].includes(q) ? q : "ru") as Lang;
  });
  const T = useMemo(() => TDICT[lang], [lang]);

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Инициализация Mini App
  useEffect(() => {
    const tg = getTG();
    try {
      tg?.ready?.();
      tg?.expand?.();
      tg?.setHeaderColor?.("secondary_bg_color");
      tg?.setBackgroundColor?.("#ffffff");
    } catch {}
  }, []);

  // Безопасное закрытие с несколькими фоллбэками
  const safeClose = () => {
    try {
      const tg = getTG();
      if (tg && typeof tg.close === "function") {
        tg.close();
        return;
      }
    } catch {}
    try {
      window.close();
    } catch {}
    try {
      history.length > 1 ? history.back() : (window.location.href = "https://t.me/HannkitBot");
    } catch {
      window.location.href = "https://t.me/HannkitBot";
    }
  };

  // Отправка «огнеупорно» + закрытие синхронно из клика
  const submit = () => {
    if (isSending) return;
    setSending(true);

    const payload = { source: "tg-miniapp", lang, name, email: mail, phone };

    // Абсолютный URL — надёжнее в iOS веб-вью
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin.replace(/\/$/, "")}/api/lead`
        : "https://hannkit.com/api/lead";

    // 1) Пытаемся sendBeacon (не блокирует закрытие страницы)
    let sentByBeacon = false;
    try {
      if ("navigator" in window && "sendBeacon" in navigator) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        sentByBeacon = navigator.sendBeacon(url, blob);
      }
    } catch {}

    // 2) Параллельно — фоллбэк fetch с keepalive (не ждём результата)
    try {
      // @ts-ignore keepalive поддерживается в современных браузерах
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {}

    // Показать тост и закрыть — в том же тике клика (важно для iOS Telegram)
    setSent(true);
    // даём кадр на перерисовку, затем закрываем
    requestAnimationFrame(() => {
      // Небольшая задержка, чтобы тост мигнул визуально
      setTimeout(safeClose, 250);
    });
  };

  return (
    <>
      {/* SDK грузим до рендера — для iOS Telegram это критично */}
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />

      <div
        style={{
          fontFamily:
            'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
          color: COLORS.text,
          background: COLORS.bg,
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 28px" }}>
          {/* Языки */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {(["ru", "en", "zh"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: `1px solid ${lang === l ? COLORS.brand : COLORS.border}`,
                  background: lang === l ? COLORS.brand : "#fff",
                  color: lang === l ? "#fff" : COLORS.text,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {l === "ru" ? T.langRU : l === "en" ? T.langEN : T.langZH}
              </button>
            ))}
          </div>

          <h1 style={{ fontSize: 36, lineHeight: 1.15, margin: "8px 0 14px", fontWeight: 800 }}>{T.title}</h1>

          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: 16,
              display: "grid",
              gap: 10,
            }}
          >
            <input
              placeholder={T.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: "12px 14px", border: `1px solid ${COLORS.border}`, borderRadius: 12, outline: "none" }}
            />
            <input
              placeholder={T.email}
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              type="email"
              style={{ padding: "12px 14px", border: `1px solid ${COLORS.border}`, borderRadius: 12, outline: "none" }}
            />
            <input
              placeholder={T.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              style={{ padding: "12px 14px", border: `1px solid ${COLORS.border}`, borderRadius: 12, outline: "none" }}
            />

            <button
              onClick={submit}
              disabled={isSending}
              style={{
                marginTop: 6,
                padding: "12px 16px",
                borderRadius: 12,
                border: "none",
                background: COLORS.brand,
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                opacity: isSending ? 0.75 : 1,
              }}
            >
              {T.send}
            </button>

            <div style={{ color: COLORS.subtext, lineHeight: 1.6, marginTop: 4 }}>{T.hint}</div>

            {sent && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  marginTop: 6,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: COLORS.chip,
                  border: `1px solid ${COLORS.border}`,
                  fontWeight: 700,
                }}
              >
                {T.sent}
              </div>
            )}

            {/* Ручное закрытие, если вдруг автозакрытие не сработало */}
            <button
              onClick={safeClose}
              style={{
                marginTop: 4,
                padding: "12px 16px",
                borderRadius: 12,
                border: `1px solid ${COLORS.border}`,
                background: "#fff",
                color: COLORS.brand,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {T.close}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
