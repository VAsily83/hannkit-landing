import React, { useMemo, useState } from 'react';

export default function LandingHannkit() {
  // ---- Палитра
  const COLORS = {
    primary: '#0B1E5B',        // тёмный хиро
    accent: '#F3F4F6',         // светлый фон секций
    text: '#111111',
    border: '#E5E7EB',
    white: '#FFFFFF',
  };

  // ---- Язык (оставляем RU как основной)
  const [uiLang, setUiLang] = useState<'ru' | 'en' | 'zh'>('ru');
  const T = useMemo(
    () =>
      ({
        ru: {
          brand: 'Hannkit',
          langLabel: 'Язык',
          heroTitle: 'Продавайте в России без рисков и вложений',
          heroLead:
            'Мы размещаем ваши товары на Wildberries, Ozon и Яндекс.Маркете, берём на себя маркетинг, логистику и поддержку. Вы получаете себестоимость + 30% от прибыли после продажи.',
          ctas: { partner: 'Стать партнёром' },
          badges: ['Wildberries', 'Ozon', 'Яндекс.Маркет'],

          whyTitle: 'Почему это выгодно производителю',
          why: [
            { title: 'Быстрый выход', text: 'Запуск продаж без инвестиций и сложных процедур' },
            { title: 'Минимум рисков', text: 'Мы берём на себя маркетинг, логистику и поддержку' },
            { title: 'Рост прибыли', text: 'Вы получаете себестоимость + 30% от прибыли' },
          ],

          howTitle: 'Как мы работаем',
          how: [
            'Анализ спроса и SKU',
            'Легализация и сертификация',
            'Поставка на склад',
            'Продажи на маркетплейсах',
            'Выплаты и отчёты',
          ],

          finTitle: 'Финансовые условия',
          fin: [
            'COGS+30% — стандартное вознаграждение',
            'Выплаты раз в месяц',
            'Все расходы на маркетинг и логистику за нами',
            'Прозрачные отчёты по продажам',
            'SLA по срокам выплат',
          ],

          trustTitle: 'Гарантии и прозрачность',
          trust: [
            { title: 'Юридическая чистота', text: 'Работаем с юрлицами, соблюдаем все нормы' },
            { title: 'Прозрачные отчёты', text: 'Регулярные дашборды и статистика' },
            { title: 'Поддержка 24/7', text: 'Отвечаем на любые вопросы партнёров' },
          ],

          catsTitle: 'Категории, с которыми работаем',
          cats: [
            'Малая бытовая техника и электроника',
            'Товары для красоты и здоровья',
            'Дом, кухня, уборка',
            'Спорт и отдых',
            'Автотовары и инструменты',
            'Детские товары',
          ],

          b2bTitle: 'B2B для продавцов маркетплейсов',
          b2bLead: 'Оптовые поставки и решения для действующих селлеров.',
          b2b: [
            { title: 'Оптовые партии', text: 'Выгодные условия закупки от минимального объёма.' },
            { title: 'White Label', text: 'Производство под нашим лейблом на вашем производстве.' },
            { title: 'Аналитика трендов', text: 'Рекомендации по SKU и ассортименту на основе данных.' },
            { title: 'Готовая логистика', text: 'Доставка на склады маркетплейсов без вашего участия.' },
          ],

          contactTitle: 'Связаться с нами',
          contactLead: 'Получите расчёт спроса и тестовую матрицу SKU за 48 часов.',
          email: 'Email',
          telegram: 'Открыть в Telegram',
          wechat: 'WeChat',
          wechatHint: 'Откройте WeChat → Поиск → ID: HardVassya',

          modalTitle: 'Оставьте заявку',
          name: 'Ваше имя',
          phone: 'Телефон',
          submit: 'Отправить',
          close: 'Закрыть',

          footer: '© 2025 Hannkit · hannkit.com. All rights reserved.',
        },
        // Для EN/ZH пока показываем русские тексты, чтобы не ломать переключатель.
        en: undefined,
        zh: undefined,
      } as const)[uiLang] || ({} as any),
    [uiLang]
  );

  // ---- Состояния формы
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // ---- Отправка формы в Formspree
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT as string;
      if (!endpoint) throw new Error('Form endpoint is not configured');

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!res.ok) throw new Error('Submit failed');

      alert('Спасибо! Заявка отправлена 🚀');
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      alert('Ошибка при отправке. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }

  // ---- Утилиты стилей
  const shell: React.CSSProperties = {
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    color: COLORS.text,
    margin: 0,
  };
  const container: React.CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: '0 20px' };
  const pill: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 16px',
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.white,
  };
  const btnPrimary: React.CSSProperties = {
    padding: '12px 18px',
    borderRadius: 12,
    border: 'none',
    background: COLORS.primary,
    color: COLORS.white,
    fontWeight: 600,
    cursor: 'pointer',
  };

  return (
    <div style={shell}>
      {/* ---------------- Header ---------------- */}
      <div style={{ background: COLORS.primary, color: COLORS.white }}>
        <div style={{ ...container, display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
          <div style={{ fontWeight: 800 }}>Hannkit</div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ opacity: 0.8 }}>{T.langLabel}</span>
            <button
              onClick={() => setUiLang('ru')}
              style={{ ...pill, background: COLORS.white, borderColor: 'transparent', fontWeight: 700 }}
            >
              RU
            </button>
            <button onClick={() => setUiLang('en')} style={{ ...pill, color: COLORS.white, background: 'transparent' }}>
              EN
            </button>
            <button onClick={() => setUiLang('zh')} style={{ ...pill, color: COLORS.white, background: 'transparent' }}>
              ZH
            </button>

            <button style={{ ...btnPrimary, background: COLORS.white, color: COLORS.primary }} onClick={() => setIsModalOpen(true)}>
              {T.ctas.partner}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- Hero ---------------- */}
      <section style={{ background: COLORS.primary, color: COLORS.white }}>
        <div style={{ ...container, paddingTop: 40, paddingBottom: 40 }}>
          <h1 style={{ fontSize: 48, lineHeight: 1.1, margin: 0, fontWeight: 800 }}>{T.heroTitle}</h1>
          <p style={{ marginTop: 16, opacity: 0.95, maxWidth: 760 }}>{T.heroLead}</p>

          <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{ ...btnPrimary }} onClick={() => setIsModalOpen(true)}>
              {T.ctas.partner}
            </button>
            {T.badges.map((b, i) => (
              <span key={i} style={{ ...pill, background: 'rgba(255,255,255,0.08)', color: COLORS.white, borderColor: 'rgba(255,255,255,0.2)' }}>
                {b}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 16,
              marginTop: 28,
            }}
          >
            {T.why.map((card, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 16,
                  padding: 18,
                }}
              >
                <div style={{ fontWeight: 700 }}>{card.title}</div>
                <div style={{ opacity: 0.9, marginTop: 6 }}>{card.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why (подробно) ---------------- */}
      <section style={{ background: COLORS.accent }}>
        <div style={{ ...container, paddingTop: 40, paddingBottom: 40 }}>
          <h2 style={{ margin: 0 }}>{T.whyTitle}</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 16,
              marginTop: 16,
            }}
          >
            {T.why.map((card, i) => (
              <div key={i} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 18 }}>
                <div style={{ fontWeight: 700 }}>{card.title}</div>
                <div style={{ marginTop: 6 }}>{card.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How ---------------- */}
      <section>
        <div style={{ ...container, paddingTop: 40, paddingBottom: 40 }}>
          <h2 style={{ margin: 0 }}>{T.howTitle}</h2>
          <ul style={{ marginTop: 12, lineHeight: 1.7 }}>
            {T.how.map((row, i) => (
              <li key={i}>{row}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Financials ---------------- */}
      <section style={{ background: COLORS.accent }}>
        <div style={{ ...container, paddingTop: 40, paddingBottom: 40 }}>
          <h2 style={{ margin: 0 }}>{T.finTitle}</h2>
          <ul style={{ marginTop: 12, lineHeight: 1.7 }}>
            {T.fin.map((row, i) => (
              <li key={i}>{row}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Trust ---------------- */}
      <section>
        <div style={{ ...container, paddingTop: 40, paddingBottom: 40 }}>
          <h2 style={{ margin: 0 }}>{T.trustTitle}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16, marginTop: 16 }}>
            {T.trust.map((card, i) => (
              <div key={i} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 18 }}>
                <div style={{ fontWeight: 700 }}>{card.title}</div>
                <div style={{ marginTop: 6 }}>{card.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section style={{ background: COLORS.accent }}>
        <div style={{ ...container, paddingTop: 40, paddingBottom: 40 }}>
          <h2 style={{ margin: 0 }}>{T.catsTitle}</h2>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {T.cats.map((c, i) => (
              <span key={i} style={pill}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- B2B ---------------- */}
      <section>
        <div style={{ ...container, paddingTop: 40, paddingBottom: 40 }}>
          <h2 style={{ margin: 0 }}>{T.b2bTitle}</h2>
          <p style={{ marginTop: 8 }}>{T.b2bLead}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16, marginTop: 16 }}>
            {T.b2b.map((b, i) => (
              <div key={i} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 18 }}>
                <div style={{ fontWeight: 700 }}>{b.title}</div>
                <div style={{ marginTop: 6 }}>{b.text}</div>
              </div>
            ))}
          </div>

          <button style={{ ...btnPrimary, marginTop: 16 }} onClick={() => setIsModalOpen(true)}>
            {T.ctas.partner}
          </button>
        </div>
      </section>

      {/* ---------------- Contacts ---------------- */}
      <section id="contact" style={{ background: COLORS.accent }}>
        <div style={{ ...container, paddingTop: 40, paddingBottom: 40 }}>
          <h2 style={{ margin: 0 }}>{T.contactTitle}</h2>
          <p style={{ marginTop: 8 }}>{T.contactLead}</p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginTop: 16,
            }}
          >
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{T.email}</div>
              <a href="mailto:Wildbizshop@gmail.com">Wildbizshop@gmail.com</a>
            </div>

            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Telegram</div>
              <a href="https://t.me/HardVassya" target="_blank" rel="noopener noreferrer">
                @HardVassya — открыть
              </a>
              <div style={{ marginTop: 10, opacity: 0.8 }}>
                WeChat: ID <b>HardVassya</b> <span style={{ opacity: 0.7 }}>({T.wechatHint})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer>
        <div style={{ ...container, paddingTop: 24, paddingBottom: 24, color: '#6B7280' }}>{T.footer}</div>
      </footer>

      {/* ---------------- Modal (Formspree) ---------------- */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{ background: COLORS.white, width: 360, borderRadius: 12, padding: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>{T.modalTitle}</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 10 }}>
                <input
                  placeholder={T.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: '10px 12px',
                  }}
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: '10px 12px',
                  }}
                />
                <input
                  placeholder={T.phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: '10px 12px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button type="submit" disabled={loading} style={{ ...btnPrimary }}>
                  {loading ? 'Отправляем…' : T.submit}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ ...pill, borderColor: COLORS.border, background: COLORS.white }}
                >
                  {T.close}
                </button>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                Нажимая «{T.submit}», вы соглашаетесь на обработку персональных данных.
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
