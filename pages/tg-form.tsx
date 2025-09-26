import React, { useState } from "react";

// локализация
const translations = {
  ru: {
    title: "Заявка",
    subtitle: "Оставьте контакты — ответим в Telegram или на почту.",
    name: "Имя",
    email: "Email",
    phone: "Телефон",
    sendBtn: "Отправить заявку",
    sent: "Заявка отправлена! Закрываем...",
    close: "Закрыть",
  },
  en: {
    title: "Application",
    subtitle: "Leave your contacts — we will reply in Telegram or by email.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    sendBtn: "Submit",
    sent: "Request sent! Closing...",
    close: "Close",
  },
  zh: {
    title: "申请",
    subtitle: "留下联系方式 — 我们会通过 Telegram 或电子邮件回复。",
    name: "姓名",
    email: "电子邮件",
    phone: "电话",
    sendBtn: "提交申请",
    sent: "请求已发送！正在关闭...",
    close: "关闭",
  },
};

const TgForm: React.FC = () => {
  const [lang, setLang] = useState<"ru" | "en" | "zh">("ru");
  const T = translations[lang];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSending) return; // замок от дублей
    setIsSending(true);

    const idempotencyKey = `${Date.now()}-${Math.random()}`;

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          source: "tg-miniapp",
          lang,
        }),
      });

      setSubmitted(true);

      // хаптик + закрытие
      const tg = (window as any).Telegram?.WebApp;
      tg?.HapticFeedback?.impactOccurred?.("light");

      setTimeout(() => {
        try {
          tg?.close?.();
        } catch (err) {
          console.error("Close error", err);
        }
      }, 600);
    } catch (err) {
      console.error("Submit error", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        {(["ru", "en", "zh"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              marginLeft: 8,
              padding: "4px 10px",
              borderRadius: 20,
              border: "1px solid #ccc",
              background: lang === l ? "#0B1E5B" : "#fff",
              color: lang === l ? "#fff" : "#000",
              fontWeight: 600,
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>{T.title}</h2>
      <p style={{ marginBottom: 20 }}>{T.subtitle}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={T.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: 12,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />
        <input
          type="email"
          placeholder={T.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: 12,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />
        <input
          type="tel"
          placeholder={T.phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: 12,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />

        {!submitted ? (
          <button
            type="submit"
            disabled={isSending}
            style={{
              width: "100%",
              padding: 12,
              background: isSending ? "#9CA3AF" : "#0B1E5B",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              borderRadius: 8,
              cursor: isSending ? "not-allowed" : "pointer",
            }}
          >
            {isSending ? "Отправляем…" : T.sendBtn}
          </button>
        ) : (
          <div
            style={{
              marginTop: 20,
              padding: 12,
              background: "#f3f4f6",
              borderRadius: 8,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {T.sent}
          </div>
        )}
      </form>

      {submitted && (
        <button
          onClick={() => (window as any).Telegram?.WebApp?.close?.()}
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 8,
            fontWeight: 600,
            color: "#0B1E5B",
          }}
        >
          {T.close}
        </button>
      )}
    </div>
  );
};

export default TgForm;
