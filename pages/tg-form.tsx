// pages/tg-form.tsx
import React, { useEffect, useMemo, useState } from "react";

// ВАЖНО: этот файл рендерится на сервере при билде,
// поэтому никаких обращений к window/Telegram вне эффектов!

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

type Lang = "ru" | "en" | "zh";

const COLORS = {
  brand: "#0B1E5B",
  text: "#111827",
  subtext: "#374151",
  bg: "#F3F4F6",
  card: "#FFFFFF",
  border: "#E5E7EB",
};

const TDICT: Record<
  Lang,
  {
    title: string;
    lead: string;
    name: string;
    email: string;
    phone: string;
    send: string;
    note: string;
    sent: string;
    closing: string;
    closeBtn: string;
    ru: string; en: string; zh: string;
  }
> = {
  ru: {
    title: "Заявка",
    lead: "Оставьте контакты — ответим в Telegram или на почту.",
    name: "Ваше имя",
    email: "Email",
    phone: "Телефон",
    send: "Отправить заявку",
    note: "Форма работает внутри Telegram. После отправки окно закроется.",
    sent: "Заявка отправлена!",
    closing: "Закрываем…",
    closeBtn: "Закрыть",
    ru: "РУ", en: "EN", zh: "中文",
  },
  en: {
    title: "Request",
    lead: "Leave your contacts — we’ll reply in Telegram or by email.",
    name: "Your name",
    email: "Email",
    phone: "Phone",
    send: "Send request",
    note: "This form runs inside Telegram. The window will close after sending.",
    sent: "Request sent!",
    closing: "Closing…",
    closeBtn: "Close",
    ru: "RU", en: "EN", zh: "中文",
  },
  zh: {
    title: "提交咨询",
    lead: "留下联系方式——我们会在 Telegram 或邮箱回复。",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    send: "发送",
    note: "该表单在 Telegram 内运行。发送后窗口会关闭。",
    sent: "已发送！",
    closing: "正在关闭…",
    closeBtn: "关闭",
    ru: "俄", en: "英", zh: "中",
  },
};

const FORMSPREE = "/api/lead";

export default function TgFormPage() {
  const [lang, setLang] = useState<Lang>("ru");
  const T = useMemo(() => TDICT[lang], [lang]);

  const [mounted, setMounted] = useState(false);
  const isTg = useMemo(
    () => mounted && typeof window !== "undefined" && !!window.Telegram?.WebApp,
    [mounted]
  );

  // Поля формы
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "fail">(null);

  // Mount + Telegram init
  useEffect(() => {
    setMounted(true);

    // Инициализация Telegram WebApp (если внутри мини-аппа)
    try {
      const W = window as any;
      if (W?.Telegram?.WebApp) {
        const wa = W.Telegram.WebApp;
        wa.ready?.();
        wa.expand?.(); // чтобы занять доступную высоту
      }
    } catch {
      /* ignore */
    }
  }, []);

  const haptic = (type: "success" | "error" | "warning" = "success") => {
    try {
      if (isTg) {
        window.Telegram!.WebApp.HapticFeedback?.notificationOccurred?.(type);
      }
    } catch {
      /* ignore */
    }
  };

  // Универсальное закрытие с каскадом фолбэков
  const closeWithFallbacks = () => {
    let closed = false;

    try {
      if (isTg) {
        // Основной путь — закрыть мини-апп
        window.Telegram!.WebApp.close();
        closed = true;
      }
    } catch {
      /* ignore */
    }

    // Дадим клиенту до ~600 мс «физически» закрыть окно.
    setTimeout(() => {
      if (closed) return;

      // 1) Попробуем вернуться назад (часто работает в SFSafariViewController)
      try {
        window.history.back();
      } catch {
        /* ignore */
      }

      // 2) Попробуем закрыть вкладку (может быть заблокировано браузером)
      setTimeout(() => {
        try {
          window.close();
        } catch {
          /* ignore */
        }
      }, 120);

      // 3) Жёсткий фолбэк — открыть чат, Telegram обычно перехватывает tg:// и скрывает webview
      setTimeout(() => {
        try {
          // Попытка deeplink
          (window.location as any).href = "tg://resolve?domain=HannkitBot";
        } catch {
          /* ignore */
        }
      }, 240);

      // 4) Финальный фолбэк — обычная http-ссылка на бота
      setTimeout(() => {
        try {
          (window.location as any).href = "https://t.me/HannkitBot";
        } catch {
          /* ignore */
        }
      }, 480);
    }, 600);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setSent(null);
    try {
      const r = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email: mail,
          phone,
          source: "tg-miniapp",
          lang,
        }),
      });

      if (r.ok) {
        setSent("ok");
        haptic("success");

        // Немного показываем сообщение и закрываем с фолбэками
        setTimeout(() => {
          closeWithFallbacks();
        }, 700);
      } else {
        throw new Error("Request failed");
      }
    } catch {
      setSent("fail");
      haptic("error");
      // В браузере остаёмся на странице; в Telegram пользователь может нажать «Закрыть»
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
        color: COLORS.text,
        background: COLORS.bg,
        minHeight: "100vh",
        padding: 16,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 6px 18px rgba(0,0,0,.06)",
        }}
      >
        {/* Языки */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {(["ru", "en", "zh"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: `1px solid ${l === lang ? COLORS.brand : COLORS.border}`,
                background: l === lang ? COLORS.brand : "transparent",
                color: l === lang ? "#fff" : COLORS.text,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {TDICT[l][l]}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: 34, margin: "6px 0 8px" }}>{T.title}</h1>
        <p style={{ color: COLORS.subtext, margin: "0 0 14px", fontSize: 18 }}>{T.lead}</p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder={T.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
              outline: "none",
            }}
          />
          <input
            placeholder={T.email}
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            type="email"
            required
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
              outline: "none",
            }}
          />
          <input
            placeholder={T.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
              outline: "none",
            }}
          />

        <button
            type="submit"
            disabled={sending}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: sending ? "#152a7e" : COLORS.brand,
              color: "#fff",
              fontWeight: 700,
              cursor: sending ? "default" : "pointer",
            }}
          >
            {T.send}
          </button>
        </form>

        <p style={{ color: COLORS.subtext, margin: "12px 0 10px" }}>{T.note}</p>

        {/* Сообщения статуса */}
        {sent === "ok" && (
          <div
            style={{
              background: "#F3F4F6",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "10px 12px",
              fontWeight: 700,
            }}
          >
            {T.sent} {T.closing}
          </div>
        )}
        {sent === "fail" && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 12,
              padding: "10px 12px",
              fontWeight: 700,
              color: "#991B1B",
            }}
          >
            Ошибка отправки. Попробуйте ещё раз или вернитесь в бот.
          </div>
        )}

        {/* Ручная кнопка закрытия видна только в Telegram */}
        {mounted && isTg && (
          <div style={{ marginTop: 12 }}>
            <button
              onClick={closeWithFallbacks}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.card,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {T.closeBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Чтобы Vercel / Next.js НЕ пытались статически пререндерить /tg-form на билде,
 * заставляем страницу рендериться на запросе.
 */
export async function getServerSideProps() {
  return { props: {} };
}
