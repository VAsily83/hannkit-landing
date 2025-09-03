import React, { useState } from 'react';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | 'ok' | 'err'>(null);
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [agree, setAgree] = useState(true);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) return;
    try {
      setSending(true); setSent(null);
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, note })
      });
      const data = await r.json();
      if (r.ok && data?.ok) {
        setSent('ok');
        setTimeout(() => { setOpen(false); setSent(null); }, 1200);
        setName(''); setEmail(''); setPhone(''); setNote('');
      } else setSent('err');
    } catch { setSent('err'); }
    finally { setSending(false); }
  }

  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom:14}}>
            <strong>Hannkit</strong>
            <button className="btn btn-light" onClick={()=>setOpen(true)}>Стать партнёром</button>
          </div>
          <h1>Продавайте в России без рисков и вложений</h1>
          <p>Мы размещаем ваши товары на Wildberries, Ozon и Яндекс.Маркете, берём на себя маркетинг, логистику и поддержку. Вы получаете себестоимость + 30% от прибыли после продажи.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={()=>setOpen(true)}>Стать партнёром</button>
            <span className="pill">Wildberries</span>
            <span className="pill">Ozon</span>
            <span className="pill">Яндекс.Маркет</span>
          </div>
        </div>
      </div>

      {/* ПОЧЕМУ */}
      <section className="section">
        <div className="container">
          <h2>Почему это выгодно производителю</h2>
          <div className="grid grid-3" style={{marginTop:16}}>
            <div className="card"><b>Быстрый выход</b><div className="small">Запуск продаж без инвестиций и сложных процедур</div></div>
            <div className="card"><b>Минимум рисков</b><div className="small">Мы берём на себя маркетинг, логистику и поддержку</div></div>
            <div className="card"><b>Рост прибыли</b><div className="small">Вы получаете себестоимость + 30% от прибыли</div></div>
          </div>
        </div>
      </section>

      {/* КАК РАБОТАЕМ */}
      <section className="section" style={{background:'#fff'}}>
        <div className="container">
          <h2>Как мы работаем</h2>
          <ul>
            <li>Анализ спроса и SKU</li>
            <li>Легализация и сертификация</li>
            <li>Поставка на склад</li>
            <li>Продажи на маркетплейсах</li>
            <li>Выплаты и отчёты</li>
          </ul>
        </div>
      </section>

      {/* ФИНАНСЫ */}
      <section className="section">
        <div className="container">
          <h2>Финансовые условия</h2>
        <ul>
          <li>COGS+30% — стандартное вознаграждение</li>
          <li>Выплаты раз в месяц</li>
          <li>Все расходы на маркетинг и логистику за нами</li>
          <li>Прозрачные отчёты по продажам</li>
          <li>SLA по срокам выплат</li>
        </ul>
        </div>
      </section>

      {/* ГАРАНТИИ */}
      <section className="section" style={{background:'#fff'}}>
        <div className="container">
          <h2>Гарантии и прозрачность</h2>
          <div className="grid grid-3" style={{marginTop:16}}>
            <div className="card"><b>Юридическая чистота</b><div className="small">Работаем с юрлицами, соблюдаем все нормы</div></div>
            <div className="card"><b>Прозрачные отчёты</b><div className="small">Регулярные дашборды и статистика</div></div>
            <div className="card"><b>Поддержка 24/7</b><div className="small">Отвечаем на любые вопросы партнёров</div></div>
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="section">
        <div className="container" id="b2b">
          <h2>B2B для продавцов маркетплейсов</h2>
          <div className="grid grid-4" style={{marginTop:16}}>
            <div className="card"><b>Оптовые партии</b><div className="small">Выгодные условия закупки от минимального объёма</div></div>
            <div className="card"><b>White Label</b><div className="small">Производство под нашим лейблом на вашем производстве</div></div>
            <div className="card"><b>Аналитика трендов</b><div className="small">Рекомендации по SKU и ассортименту</div></div>
            <div className="card"><b>Готовая логистика</b><div className="small">Доставка на склады маркетплейсов без вашего участия</div></div>
          </div>
          <div style={{marginTop:16}}>
            <button className="btn btn-primary" onClick={()=>setOpen(true)}>Стать партнёром</button>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section className="section" style={{background:'#fff'}}>
        <div className="container" id="contact">
          <h2>Связаться с нами</h2>
          <p className="small">Получите расчёт спроса и тестовую матрицу SKU за 48 часов.</p>
          <div className="grid grid-2">
            <div className="card">
              <b>Email</b>
              <div>Wildbizshop@gmail.com</div>
            </div>
            <div className="card">
              <b>Telegram</b>
              <div><a href="https://t.me/HardVassya" target="_blank" rel="noreferrer">@HardVassya — открыть</a></div>
              <div className="small" style={{marginTop:8}}>WeChat: ID <b>HardVassya</b> (Откройте WeChat → Поиск → ID)</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">© 2025 Hannkit · hannkit.com. All rights reserved.</div>
      </footer>

      {/* MODAL */}
      {open && (
        <div className="modal-backdrop" onClick={()=>setOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3 style={{marginTop:0}}>Оставьте заявку</h3>
            <form onSubmit={submitLead}>
              <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
                <input className="input" placeholder="Ваше имя" value={name} onChange={e=>setName(e.target.value)} />
                <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <input className="input" placeholder="Телефон" value={phone} onChange={e=>setPhone(e.target.value)} />
                <div />
              </div>
              <div style={{marginTop:12}}>
                <textarea className="textarea" placeholder="Комментарий (по желанию)" value={note} onChange={e=>setNote(e.target.value)} />
              </div>
              <label style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
                <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} />
                <span className="small">Отправляя форму, вы соглашаетесь с обработкой персональных данных.</span>
              </label>
              <div className="row" style={{marginTop:12}}>
                <button className="btn btn-primary" disabled={sending || !agree}>
                  {sending ? 'Отправляем…' : 'Отправить'}
                </button>
                <button type="button" className="btn" onClick={()=>setOpen(false)}>Закрыть</button>
              </div>
              {sent==='ok' && <div className="small" style={{color:'green',marginTop:8}}>Спасибо! Мы свяжемся с вами.</div>}
              {sent==='err' && <div className="small" style={{color:'crimson',marginTop:8}}>Не получилось отправить. Попробуйте позже.</div>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
