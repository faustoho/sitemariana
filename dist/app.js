(() => {
  const config = window.SITE_CONFIG || {};
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = type => Number(parts.find(p => p.type === type).value);
  const today = new Date(part('year'), part('month') - 1, part('day'));
  let month = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected = null;
  const calendar = document.getElementById('calendar');
  const format = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
  const key = date => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  function render() {
    document.getElementById('month-label').textContent = format.format(month);
    document.getElementById('prev-month').disabled = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
    calendar.replaceChildren();
    for (let i = 0; i < month.getDay(); i++) calendar.append(document.createElement('span'));
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= count; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = day;
      button.disabled = date < today;
      button.setAttribute('aria-label', new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(date));
      button.setAttribute('aria-pressed', String(selected && key(selected) === key(date) || false));
      if (key(today) === key(date)) button.setAttribute('aria-current', 'date');
      button.addEventListener('click', () => {
        selected = date;
        document.getElementById('selected-date').textContent = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date);
        render();
        [...calendar.querySelectorAll('button')].find(b => b.textContent === String(day))?.focus();
      });
      calendar.append(button);
    }
  }
  document.getElementById('prev-month').addEventListener('click', () => { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); render(); });
  document.getElementById('next-month').addEventListener('click', () => { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); render(); });
  if (config.bookingUrl) {
    try {
      const url = new URL(config.bookingUrl);
      if (url.protocol !== 'https:') throw new Error('HTTPS required');
      const link = document.getElementById('booking-link'); link.href = url.href; link.hidden = false;
      document.getElementById('availability-text').textContent = 'Consulte os horários disponíveis na agenda de atendimento. A escolha de uma data aqui não reserva um horário.';
      document.getElementById('booking-note').textContent = 'Você será direcionado à agenda para escolher o horário e concluir a marcação.';
    } catch { /* An invalid URL must not enable booking. */ }
  }
  const phone = String(config.whatsapp || '').replace(/\D/g, '');
  const email = String(config.email || '');
  const hasContact = /^55\d{10,11}$/.test(phone) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const submit = document.getElementById('request-submit');
  if (hasContact) {
    submit.disabled = false;
    submit.textContent = phone ? 'Continuar no WhatsApp ↗' : 'Continuar por e-mail ↗';
    document.getElementById('booking-note').textContent = 'A solicitação precisa ser enviada no aplicativo que será aberto. Aguarde nossa confirmação antes de considerar a consulta marcada.';
    document.querySelector('.preview-note').textContent = 'Solicitações de teleconsulta · Atendimento mediante confirmação.';
  }
  document.getElementById('request-form').addEventListener('submit', event => {
    event.preventDefault();
    const status = document.getElementById('request-status');
    if (!hasContact) { status.textContent = 'O contato de atendimento ainda não foi configurado.'; return; }
    if (!selected || selected < today) { status.textContent = 'Selecione uma data no calendário.'; calendar.querySelector('button:not(:disabled)')?.focus(); return; }
    const name = document.getElementById('patient-name').value.trim();
    const period = document.getElementById('preferred-period').value;
    if (!name || !period) { status.textContent = 'Preencha seu nome e o período desejado.'; return; }
    const dateText = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(selected);
    const message = `Olá! Meu nome é ${name}. Gostaria de solicitar uma teleconsulta com a Dra. Mariana. Data de preferência: ${dateText}. Período: ${period} (horário de Brasília). Aguardo a confirmação de disponibilidade e horário.`;
    const target = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Solicitação de teleconsulta')}&body=${encodeURIComponent(message)}`;
    status.textContent = 'Envie a mensagem no aplicativo de atendimento para concluir a solicitação. A consulta ainda não está confirmada.';
    if (phone) window.open(target, '_blank', 'noopener,noreferrer'); else window.location.href = target;
  });
  render();
})();
