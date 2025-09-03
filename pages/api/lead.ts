import type { NextApiRequest, NextApiResponse } from 'next';

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
  });
}

async function sendEmail(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY!;
  const from = process.env.FROM_EMAIL!;
  const to = process.env.TO_EMAIL!;
  if (!apiKey || !from || !to) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html })
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { name, email, phone, note } = req.body || {};
    if (!name && !email && !phone) return res.status(400).json({ ok: false, error: 'empty' });

    const subject = 'Новая заявка · Hannkit';
    const lines = [
      '<b>Hannkit · Заявка</b>',
      name ? `Имя: ${name}` : null,
      email ? `Email: ${email}` : null,
      phone ? `Телефон: ${phone}` : null,
      note ? `Комментарий: ${note}` : null,
      `Время: ${new Date().toLocaleString('ru-RU')}`
    ].filter(Boolean) as string[];

    const text = lines.join('\n');
    const html = lines.join('<br/>');

    await Promise.all([sendTelegram(text), sendEmail(subject, html)]);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false });
  }
}
