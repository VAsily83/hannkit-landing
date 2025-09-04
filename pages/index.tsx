import React, { useMemo, useState } from 'react';

export default function LandingHannkit() {
  const COLORS = {
    primary: '#0B1E5B',
    accent: '#F3F4F6',
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
          email: 'Email',
          telegram: 'Telegram',
          wechat: 'WeChat',
          wechatHint: 'Откройте WeChat → Поиск → ID: HardVassya',
          modalTitle: 'Оставьте заявку',
          name: 'Ваше имя',
          phone: 'Телефон',
          submit: 'Отправить',
          close: 'Закрыть',
          footer: '© 2025 Hannkit · hannkit.com. All rights reserved.',
          langLabel: 'Язык',
        },
      } as const)[uiLang],
    [uiLang]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const makeMailtoHref = (n: string, m: string, p: string) => {
    const subject = 'Заявка с лендинга Hannkit';
    const body = `Имя: ${n || '-'}\nEmail: ${m || '-'}\nТелефон: ${p || '-'}`;
    return `mailto:Wildbizshop@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: COLORS.text }}>
      {/* Header */}
      <header style={{ background: COLORS.primary, color: '#fff', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <ul>
            {T.why.map((item, i) => (
              <li key={i}>
                <b>{item.title}:</b> {item.text}
              </li>
            ))}
          </ul>
        </section>

        {/* How */}
        <section>
          <h3>{T.howTitle}</h3>
          <ol>
            {T.how.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
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
          <ul>
            {T.trust.map((item, i) => (
              <li key={i}>
                <b>{item.title}:</b> {item.text}
              </li>
            ))}
          </ul>
        </section>

        {/* Categories */}
        <section>
          <h3>{T.catsTitle}</h3>
          <ul>
            {T.cats.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>

        {/* B2B */}
        <section>
          <h3>{T.b2bTitle}</h3>
          <p>{T.b2bLead}</p>
          <ul>
            {T.b2b.map((b, i) => (
              <li key={i}>
                <b>{b.title}:</b> {b.text}
              </li>
            ))}
          </ul>
          <button
            style={{
              marginTop: '10px',
              background: COLORS.primary,
              color: '#fff',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '6px',
            }}
            onClick={() => setIsModalOpen(true)}
          >
            {T.ctas.partner}
          </button>
        </section>

        {/* Contacts */}
        <section id="contact" style={{ marginTop: '40px' }}>
          <h3>{T.contactTitle}</h3>
          <p>{T.contactLead}</p>
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {/* Email */}
            <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '15px' }}>
              <strong>Email</strong>
              <p>
                <a href={makeMailtoHref(name, email, phone)}>Wildbizshop@gmail.com</a>
              </p>
            </div>
            {/* Telegram */}
            <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '15px' }}>
              <strong>Telegram</strong>
              <p>
                <a href="https://t.me/HardVassya" target="_blank" rel="noopener noreferrer">
                  @HardVassya
                </a>
              </p>
            </div>
            {/* WeChat */}
            <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '15px' }}>
              <strong>WeChat</strong>
              <p>
                ID: <b>HardVassya</b> ({T.wechatHint}){' '}
                <button onClick={() => navigator.clipboard.writeText('HardVassya')} style={{ marginLeft: '10px' }}>
                  Скопировать ID
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: COLORS.accent, padding: '20px', marginTop: '40px', textAlign: 'center' }}>{T.footer}</footer>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{T.modalTitle}</h3>
            <input placeholder={T.name} value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder={T.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div style={{ marginTop: '10px' }}>
              <a href={makeMailtoHref(name, email, phone)} onClick={() => setIsModalOpen(false)} style={{ marginRight: '10px' }}>
                {T.submit}
              </a>
              <button onClick={() => setIsModalOpen(false)}>{T.close}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
