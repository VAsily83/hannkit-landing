// pages/api/lead.ts
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Простой in-memory кэш для идемпотентности.
 * На Vercel часто хватает, чтобы гасить двойные клики/повторы в одном воркере.
 * TTL = 90 секунд по умолчанию.
 */
const IDEMP_TTL_MS = 90_000;
const seenKeys = new Map<string, number>();

function gcSeenKeys() {
  const now = Date.now();
  for (const [k, ts] of seenKeys.entries()) {
    if (now - ts > IDEMP_TTL_MS) seenKeys.delete(k);
  }
}

/** Безопасная строка */
function safe(s: unknown): string {
  return (typeof s === "string" ? s : "").trim();
}

/** Простейшая валидация */
function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

type LeadBody = {
  name?: string;
  email?: string;
  phone?: string;
  lang?: "ru" | "en" | "zh" | string;
  source?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  // Очистим старые ключи «по пути»
  gcSeenKeys();

  // Идемпотентность — ключ из заголовка
  const idemKey = safe(req.headers["x-idempotency-key"] as string | undefined);
  if (idemKey) {
    const prev = seenKeys.get(idemKey);
    const now = Date.now();
    if (prev && now - prev < IDEMP_TTL_MS) {
      // уже видели недавно — не дублируем отправку
      return res.status(200).json({ ok: true, deduped: true });
    }
    seenKeys.set(idemKey, now);
  }

  let body: LeadBody;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid JSON" });
  }

  const name = safe(body.name);
  const email = safe(body.email);
  const phone = safe(body.phone);
  const lang = (safe(body.lang) || "ru") as "ru" | "en" | "zh" | string;
  const source = safe(body.source) || "web";

  if (!name && !email && !phone) {
    return res.status(400).json({ ok: false, error: "Empty payload" });
  }
  if (email && !isEmail(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email" });
  }

  // Telegram creds
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID; // пример: "-1001234567890"

  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing");
    return res.status(500).json({ ok: false, error: "Server is not configured" });
  }

  // Текст сообщения
  const flag =
    lang === "zh" ? "cn" : lang === "en" ? "en" : "ru";

  const lines = [
    "📩 <b>Новая заявка с hannkit.com</b>",
    "",
    `👤 <b>Имя:</b> ${name || "—"}`,
    `✉️ <b>Email:</b> ${email || "—"}`,
    `📞 <b>Телефон:</b> ${phone || "—"}`,
    `🏷 <b>Язык:</b> ${flag}`,
    `🧭 <b>Источник:</b> ${source}`,
  ];

  const text = lines.join("\n");

  // Отправка в Telegram
  try {
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const resp = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => "");
      console.error("Telegram send error:", resp.status, errTxt);
      return res.status(502).json({ ok: false, error: "Telegram send failed" });
    }
  } catch (e) {
    console.error("Telegram send exception:", e);
    return res.status(502).json({ ok: false, error: "Telegram unreachable" });
  }

  return res.status(200).json({ ok: true });
}
