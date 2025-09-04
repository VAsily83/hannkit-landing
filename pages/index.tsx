import React, { useMemo, useState } from 'react';

export default function LandingHannkit() {
  const COLORS = {
    primary: '#0B1E5B',
    accent: '#F9FAFB',
    text: '#111111',
    border: '#E5E7EB',
  };

  const [uiLang, setUiLang] = useState('ru');
  const T = useMemo(
    () =>
      ({
        ru: {
          brand: 'Hannkit',
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
          footer: '© 2025 Hannkit · hannkit.com. All rights reserved.',
        },
      } as const)[uiLang],
    [uiLang]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: COLORS.text }}>
      {/* Header */}
      <header style={{ background: COLORS.primary, color: '#fff', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1>{T.brand}</h1>
        <button
          style={{
            background: '#fff',
            color: COLORS.primary,
            padding: '10px 15px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 600,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          {T.ctas.partner}
        </button>
      </header>

      {/* Hero */}
      <main style={{ padding: '40px' }}>
        <h2>{T.heroTitle}</h2>
        <p>{T.heroLead}</p>
        <button
          style={{
            background: '#fff',
            color: COLORS.primary,
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontWeight: 600,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          {T.ctas.partner}
        </button>

        {/* Why */}
        <section>
          <h3>{T.whyTitle}</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {T.why.map((item, i) => (
              <div key={i} style={{ background: COLORS.accent, padding: '20px', borderRadius: '8px', flex: '1 1 200px' }}>
                <b>{item.title}</b>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How */}
        <section>
          <h3>{T.howTitle}</h3>
          <ul>
            {T.how.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </section>

        {/* Financials */}
        <section>
          <h3>{T.finTitle}</h3>
          <ul>
            {T.fin.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Trust */}
        <section>
          <h3>{T.trustTitle}</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {T.trust.map((item, i) => (
              <div key={i} style={{ background: COLORS.accent, padding: '20px', borderRadius: '8px', flex: '1 1 200px' }}>
                <b>{item.title}</b>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h3>{T.catsTitle}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {T.cats.map((c, i) => (
              <span key={i} style={{ padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '20px', background: '#fff' }}>
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* B2B */}
        <section>
          <h3>{T.b2bTitle}</h3>
          <p>{T.b2bLead}</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {T.b2b.map((b, i) => (
              <div key={i} style={{ background: COLORS.accent, padding: '20px', borderRadius: '8px', flex: '1 1 200px' }}>
                <b>{b.title}</b>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
          <button
            style={{
              marginTop: '20px',
              background: COLORS.primary,
              color: '#fff',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
            }}
            onClick={() => setIsModalOpen(true)}
          >
            {T.ctas.partner}
          </button>
        </section>

        {/* Contacts */}
        <section style={{ marginTop: '40px' }}>
          <h3>{T.contactTitle}</h3>
          <p>{T.contactLead}</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '15px', flex: '1 1 200px' }}>
              <strong>Email</strong>
              <p><a href="mailto:Wildbizshop@gmail.com">Wildbizshop@gmail.com</a></p>
            </div>
            <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '15px', flex: '1 1 200px' }}>
              <strong>Telegram</strong>
              <p><a href="https://t.me/HardVassya" target="_blank" rel="noopener noreferrer">@HardVassya</a></p>
            </div>
            <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '15px', flex: '1 1 200px' }}>
              <strong>WeChat</strong>
              <p>ID: <b>HardVassya</b> <br /> (Откройте WeChat → Поиск → ID)</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: COLORS.accent, padding: '20px', marginTop: '40px', textAlign: 'center' }}>{T.footer}</footer>
    </div>
  );
}
