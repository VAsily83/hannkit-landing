// pages/api/tg-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SITE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || ""; // https://hannkit.com
const WEBAPP_URL = `${SITE}/tg-form`; // страница WebApp

type Lang = "ru" | "en" | "zh";

const T: Record<Lang, { text: string; btn: string }> = {
  ru: {
    text: "Откройте форму и отправьте заявку. Мы ответим в ближайшее время.",
    btn: "Открыть форму",
  },
  en: {
    text: "Open the form and send your request. We'll reply shortly.",
    btn: "Open form",
  },
  zh: {
    text: "打开表单并提交申请，我们会尽快回复。",
    btn: "打开表单",
  },
};

function pickLang(code?: string): Lang {
  const c = (code || "").toLowerCase();
  if (c.startsWith("zh")) return "zh";
  if (c.startsWith("en")) return "en";
  return "ru";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const update = req.body;

    const msg = update?.message || update?.edited_message;
    const chatId = msg?.chat?.id;
    const text = (msg?.text || "").trim();
    const fromLang = pickLang(msg?.from?.language_code);

    if (!chatId) return res.status(200).json({ ok: true });

    if (/^\/start\b/i.test(text) || !text) {
      const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
      const payload = {
        chat_id: chatId,
        text: T[fromLang].text,
        reply_markup: {
          keyboard: [
            [
              {
                text: T[fromLang].btn,
                web_app: { url: `${WEBAPP_URL}?lang=${fromLang}` },
              },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      };

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("tg-webhook error:", e);
    return res.status(200).json({ ok: true });
  }
}
