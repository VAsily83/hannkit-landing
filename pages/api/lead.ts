import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { name, email, phone, lang } = req.body;

  if (!name && !email && !phone) {
    return res.status(400).json({ ok: false, error: "No data" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const threadId = process.env.TELEGRAM_THREAD_ID; // опционально

  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: "Missing Telegram config" });
  }

  const text =
    `📩 Новая заявка с hannkit.com` +
    `\n\n🧍‍♂️ Имя: ${name || "-"}` +
    `\n📧 Email: ${email || "-"}` +
    `\n📱 Телефон: ${phone || "-"}` +
    `\n🌐 Язык: ${lang || "-"}`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body: Record<string, any> = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    };
    if (threadId) body.message_thread_id = threadId;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await tgRes.json();
    if (!data.ok) throw new Error(data.description);

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("Telegram error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Send failed" });
  }
}
