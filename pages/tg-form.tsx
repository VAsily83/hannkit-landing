// pages/tg-form.tsx
import React, { useEffect, useMemo, useState } from "react";

type Lang = "ru" | "en" | "zh";

const TDICT: Record<
  Lang,
  {
    title: string;
    lead: string;
    name: string;
    email: string;
    phone: string;
    send: string;
    sending: string;
    sent: string;
    close: string;
  }
> = {
  ru: {
    title: "Заявка",
    lead: "Оставьте контакты — ответим в Telegram или на почту.",
    name: "Имя",
    email: "Email",
    phone: "Телефон",
    send: "Отправить заявку",
    sending: "Отправляем…",
    sent: "Заявка отправлена! Закрываем…",
    close: "Закрыть",
  },
  en: {
    title: "Application",
    lead: "Leave your contacts — we’ll reply in Telegram or by email.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    send: "Submit",
    sending: "Sending…",
    sent: "Request sent! Closing…",
    close: "Close",
  },
  zh: {
    title: "申请",
    lead: "留下联系方式 — 我们会通过 Telegram 或邮箱回复。",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    send: "提交申请",
    sending: "发送中…",
    sent: "已发送！正在关闭…",
    close: "关闭",
  },
};

const BOT_LINK = "https://t.me/HannkitBot"; // fallback-редирект

export default function TgForm() {
  const [lang, setLang] = useState<Lang>("ru");
  const T = useMemo(() => TDICT[lang], [lang]);

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Инициализация мини-аппа (важно на iOS)
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    try {
      tg?.ready?.();
      tg?.expand?.();
      tg?.disableVerticalSwipes?.();
      tg?.disableClosingConfirmation?.();
    } catch {}
  }, []);

  // Универсальное «жёсткое» закрытие
  const robustClose = () => {
    const tg = (window as any).Telegram?.WebApp;

    // снять фокус c активного поля (иначе iOS может не закрыть webview)
    try {
      const el = document.activeElement as HTMLElement | null;
      el?.blur?.();
    } catch {}

    // несколько попыток закрытия
    const tryClose = () => {
      try {
        tg?.HapticFeedback?.impactOccurred?.("light");
      } catch {}
      try {
        tg?.close?.();
      } catch {}
    };

    tryClose(); // сразу
    // на следующий кадр рендера
    try {
      (window as any).requestAnimationFrame?.(() => tryClose());
    } catch {}
    // через небольшие задержки (бридж иногда догружается)
    setTimeout(tryClose, 200);
    setTimeout(tryClose, 800);

    // крайний fallback: выйти в бот
    setTimeout(() => {
      try {
        // если всё ещё не закрылось — редирект наружу
        if (document.visibilityState === "visible") {
          window.location.replace(BOT_LINK);
        }
      } catch {
        window.location.href = BOT_LINK;
      }
    }, 1500);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": key,
        },
        body: JSON.stringify({
          name,
          email: mail,
          phone,
          source: "tg-miniapp",
          lang,
        }),
      });

      // если сеть отработала — считаем успехом (idempotent на сервере)
      if (r.ok || r.status === 409) {
        setSubmitted(true);
        robustClose();
      } else {
        // даже если сервер вернул не 200 — покажем «отправлено» и попробуем закрыть,
        // чтобы поведение для пользователя было одинаковым
        setSubmitted(true);
        robustClose();
      }
    } catch (err) {
      // сеть упала — всё равно пытаемся закрыть, чтобы не зависать
      setSubmitted(true);
      robustClose();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: 16,
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* язык */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        {(["ru", "en", "zh"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid #D1D5DB",
              background: lang === l ? "#0B1E5B" : "#fff",
              color: lang === l ? "#fff" : "#111827",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <h1 style={{ fontSize: 34, margin: "10px 0 8px", fontWeight: 800 }}>{T.title}</h1>
      <p style={{ color: "#374151", margin: "0 0 16px" }}>{T.lead}</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder={T.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            outline: "none",
          }}
        />
        <input
          type="email"
          placeholder={T.email}
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            outline: "none",
          }}
        />
        <input
          type="tel"
          placeholder={T.phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            outline: "none",
          }}
        />

        {!submitted ? (
          <button
            type="submit"
            disabled={isSending}
            style={{
              padding: "12px 16px",
              background: isSending ? "#9CA3AF" : "#0B1E5B",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 800,
              cursor: isSending ? "not-allowed" : "pointer",
            }}
          >
            {isSending ? T.sending : T.send}
          </button>
        ) : (
          <div
            style={{
              padding: "12px 16px",
              background: "#F3F4F6",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {T.sent}
          </div>
        )}
      </form>

      {/* Кнопка явного закрытия — тоже через robustClose */}
      <button
        onClick={robustClose}
        style={{
          marginTop: 14,
          width: "100%",
          padding: "12px 16px",
          background: "#fff",
          color: "#0B1E5B",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        {T.close}
      </button>
    </div>
  );
}
