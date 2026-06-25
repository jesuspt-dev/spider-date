const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

let emailjsConfig = {
  publicKey: 'zl_ycJiJe3xEzX3kQ',
  serviceId: 'service_spider',
  templateId: 'template_spider'
};

const state = {
  screen: 'intro',
  plannerIndex: 0,
  quizIndex: 0,
  answers: JSON.parse(localStorage.getItem('spiderDateAnswers') || '{}'),
  quiz: [],
  quizAttempts: 0
};

const planner = [
  {
    key: 'saludo',
    title: '¿Cómo quieres que te salude cuando te vea?',
    hint: 'El protocolo de bienvenida es importante.',
    type: 'single',
    options: [['💋', 'Beso apasionado'], ['🍑', 'Cachetada en el [...'], ['🤝', 'Apretón de manos'], ['😘', 'Beso en la mejilla']],
    required: true
  },
  {
    key: 'comida',
    title: '¿Dónde comemos antes de la peli?',
    hint: 'Elige sin presión. Mentira: sushi suma puntos.',
    type: 'singleCustom',
    options: [['🍣', 'Kaisen'], ['🍱', 'Sushi O'], ['🥩', 'Bar de carnes'], ['🍝', 'Italiano']],
    required: true
  },
  {
    key: 'peli',
    title: '¿Qué película vemos?',
    hint: 'Pregunta trampa, pero queda bonito preguntarlo.',
    type: 'single',
    options: [['🕷️', 'Spider-Man: Brand New Day'], ['🕸️', 'Spider-Man: Across'], ['🎬', 'Lo que elijas'], ['🍿', 'Sorpresa']],
    required: true
  },
  {
    key: 'outfit',
    title: 'Outfit oficial de la cita',
    hint: 'Elige el mood. Se respetará con solemnidad.',
    type: 'single',
    options: [['✨', 'Elegante'], ['👕', 'Casual guapa'], ['🕷️', 'Cosplay Spider'], ['😎', 'Lo que salga']],
    required: true
  },
  {
    key: 'flores',
    title: '¿Qué flores quieres en tu ramo?',
    hint: 'Puedes elegir varias.',
    type: 'multiCustom',
    options: [['🌹', 'Rosas'], ['🌷', 'Tulipanes'], ['🌻', 'Girasoles'], ['🌸', 'Cerezos']],
    required: true
  },
  {
    key: 'postre',
    title: 'Postre después de comer',
    hint: 'También vale robarme el mío.',
    type: 'singleCustom',
    options: [['🍨', 'Helado'], ['🍰', 'Tarta'], ['🧇', 'Gofre'], ['🍫', 'Chocolate']],
    required: false
  },
  {
    key: 'bebida',
    title: 'Bebida del plan',
    hint: 'Para después o para fingir que somos adultos.',
    type: 'singleCustom',
    options: [['🍹', 'Cóctel'], ['🍷', 'Vino'], ['🥤', 'Refresco'], ['☕', 'Café']],
    required: false
  },
  {
    key: 'extras',
    title: 'Extras desbloqueables',
    hint: 'Selecciona todos los que quieras.',
    type: 'multi',
    options: [['🚶‍♀️', 'Paseo'], ['📸', 'Fotos'], ['🎮', 'Arcade'], ['🌃', 'Atardecer']],
    required: false
  },
  {
    key: 'mensaje',
    title: 'Mensaje secreto antes de la cita',
    hint: 'Última oportunidad para condiciones o indirectas.',
    type: 'text',
    required: false
  }
];

const bank = [
  { d: 'Fácil', q: '¿Qué representa el activo en el balance?', a: ['Bienes y derechos controlados', 'Solo deudas con bancos', 'Solo dinero en caja', 'Aportaciones socios'], c: 0 },
  { d: 'Fácil', q: 'Ecuación básica del patrimonio:', a: ['Activo = Pasivo + Patrimonio', 'Pasivo = Activo + Patrimonio', 'Ingresos = Gastos + Activo', 'Activo = Gastos - Ingresos'], c: 0 },
  { d: 'Fácil', q: 'Amortización contable recoge:', a: ['Pérdida de valor por uso', 'Pago de deuda', 'Compra de existencias', 'Retención a trabajadores'], c: 0 },
  { d: 'Fácil', q: 'Cuenta 572 Bancos pertenece a:', a: ['Activo corriente', 'Patrimonio neto', 'Pasivo no corriente', 'Gastos financieros'], c: 0 },
  { d: 'Media', q: 'Compra de acciones sin especulación:', a: ['Activo financiero', 'Existencias', 'Deuda financiera', 'Inmovilizado'], c: 0 },
  { d: 'Media', q: 'Principio de devengo:', a: ['Ingresos cuando ocurren', 'Todo al cobrar', 'Gastos reales', 'Ingresos al facturar'], c: 0 },
  { d: 'Media', q: 'Diferencia temporaria imponible:', a: ['Pasivo diferido', 'Activo diferido', 'Reserva voluntaria', 'Pérdida irreversible'], c: 0 },
  { d: 'Media', q: 'Deterioro de valor de activo:', a: ['Valor supera importe recuperable', 'Precio sube', 'Amortizado totalmente', 'Empresa con beneficios'], c: 0 },
  { d: 'Difícil', q: 'Coste amortizado - tipo interés efectivo:', a: ['Distribuye ingresos/gastos', 'Calcula intereses simples', 'Amortizaciones fiscales', 'Establece provisiones'], c: 0 },
  { d: 'Difícil', q: 'Subvención de capital - imputación:', a: ['Proporción a amortización', 'Totalmente en ejercicio', 'Reserva patrimonio', 'Al vender'], c: 0 },
  { d: 'Difícil', q: 'Amortización fiscal > contable:', a: ['Diferencia temporaria', 'Ingreso extraordinario', 'Pérdida irreversible', 'Crédito sin límite'], c: 0 },
  { d: 'Difícil', q: 'Arrendamiento financiero:', a: ['Activo derecho de uso', 'Gasto de arrendamiento', 'Opción contingente', 'Pago al contado'], c: 0 },
  { d: 'Fácil', q: 'Existencias son:', a: ['Activo corriente', 'Pasivo corriente', 'Patrimonio neto', 'Inmovilizado siempre'], c: 0 },
  { d: 'Media', q: 'Valor razonable:', a: ['Precio en transacción ordenada', 'Precio histórico', 'Valor contable neto', 'Precio negociado'], c: 0 },
  { d: 'Difícil', q: 'Provisión se reconoce:', a: ['Obligación presente', 'Posibilidad remota', 'Beneficio futuro', 'Oportunidad inversión'], c: 0 }
];

emailjs.init(emailjsConfig.publicKey);

// UTILIDADES
function save() {
  localStorage.setItem('spiderDateAnswers', JSON.stringify(state.answers));
}

function show(name) {
  state.screen = name;
  $$('.screen').forEach(s => s.classList.toggle('active', s.dataset.screen === name));
  if (name === 'planner') renderPlanner();
  if (name === 'success') renderSummary();
  window.scrollTo(0, 0);
}

function toast(t) {
  const el = $('#toast');
  el.textContent = t;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function isStepValid(step) {
  if (!step.required) return true;
  const val = state.answers[step.key];
  if (step.type === 'multi' || step.type === 'multiCustom') {
    return Array.isArray(val) && val.length > 0;
  }
  return val && val.toString().trim() !== '';
}

// RENDERIZADO
function renderPlanner() {
  const step = planner[state.plannerIndex];
  const val = state.answers[step.key];
  
  $('#plannerStep').textContent = state.plannerIndex + 1;
  $('#plannerProgress').style.width = `${((state.plannerIndex + 1) / planner.length) * 100}%`;
  
  let html = `<div class="planner-card"><p class="eyebrow">${step.hint}</p><h3>${step.title}</h3>`;
  
  if (['single', 'singleCustom'].includes(step.type)) {
    html += `<div class="option-grid">${step.options
      .map(o => `<button class="option ${val === o[1] ? 'selected' : ''}" data-select="${o[1]}" aria-pressed="${val === o[1]}"><span class="emoji">${o[0]}</span><span class="text">${o[1]}</span></button>`)
      .join('')}</div>`;
  }
  
  if (['multi', 'multiCustom'].includes(step.type)) {
    const selected = Array.isArray(val) ? val : [];
    html += `<div class="chip-area">${step.options
      .map(o => `<button class="chip ${selected.includes(o[1]) ? 'selected' : ''}" data-toggle="${o[1]}" aria-pressed="${selected.includes(o[1])}"><span>${o[0]} ${o[1]}</span></button>`)
      .join('')}</div>`;
  }
  
  if (step.type === 'text')
    html += `<textarea class="textarea" id="textAnswer" placeholder="Escribe aquí...">${val || ''}</textarea>`;
  
  const isValid = isStepValid(step);
  html += `<div class="nav-row"><button class="ghost" data-action="prevPlanner">← Atrás</button><button class="primary" data-action="nextPlanner" ${!isValid && step.required ? 'disabled' : ''}>${state.plannerIndex === planner.length - 1 ? '🔒 Bloquear cita' : 'Siguiente →'}</button></div></div>`;
  
  $('#plannerContent').innerHTML = html;
}

function startQuiz() {
  state.quiz = [...bank]
    .sort(() => Math.random() - 0.5)
    .sort((a, b) => ['Fácil', 'Media', 'Difícil'].indexOf(a.d) - ['Fácil', 'Media', 'Difícil'].indexOf(b.d))
    .slice(0, 12);
  state.quizIndex = 0;
  state.quizAttempts++;
  renderQuiz();
}

function renderQuiz() {
  const q = state.quiz[state.quizIndex];
  $('#quizStep').textContent = state.quizIndex + 1;
  $('#quizProgress').style.width = `${((state.quizIndex + 1) / 12) * 100}%`;
  $('#difficultyLabel').textContent = `Nivel ${q.d.toLowerCase()}`;
  
  let html = `<div class="question">${q.q}</div><div class="answers">`;
  html += q.a.map((a, i) => `<button class="answer-btn" data-answer="${i}">${a}</button>`).join('');
  html += `</div>`;
  
  $('#quizContent').innerHTML = html;
}

function renderSummary() {
  const map = {
    saludo: 'Saludo',
    comida: 'Comida',
    peli: 'Película',
    outfit: 'Outfit',
    flores: 'Flores',
    postre: 'Postre',
    bebida: 'Bebida',
    extras: 'Extras',
    mensaje: 'Mensaje'
  };
  
  let html = '';
  Object.entries(state.answers).forEach(([k, v]) => {
    if (map[k]) {
      html += `<p><strong>${map[k]}:</strong> ${Array.isArray(v) ? v.join(', ') : v}</p>`;
    }
  });
  
  $('#summary').innerHTML = html;
}

function sendEmail() {
  toast('📧 Enviando email...');
  
  const answerText = Object.entries(state.answers)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n');
  
  const templateParams = {
    to_email: 'raviolink12@gmail.com',
    subject: '🕷️ Spider-Date: Cita desbloqueada para el 29 de Julio',
    message: `¡Hola!\n\n🎉 Cita confirmada para el 29 de Julio\n\nDetalles planificados:\n\n${answerText}\n\n¡Que lo disfrutemos! 🎉`
  };
  
  emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, templateParams)
    .then(response => {
      console.log('Email enviado:', response);
      toast('✓ ¡Email enviado correctamente!');
    })
    .catch(error => {
      console.error('Error email:', error);
      toast('✗ Error al enviar email - intenta manualmente');
    });
}

function copySummary() {
  const txt = 'Cita desbloqueada para el 29 de Julio:\n' + Object.entries(state.answers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n');
  navigator.clipboard?.writeText(txt);
  toast('✓ Copiado al portapapeles');
}

// EVENTOS
document.addEventListener('click', e => {
  const a = e.target.closest('[data-action]')?.dataset.action;
  const step = planner[state.plannerIndex];
  
  if (e.target.closest('[data-select]')) {
    state.answers[step.key] = e.target.closest('[data-select]').dataset.select;
    save();
    renderPlanner();
  }
  
  if (e.target.closest('[data-toggle]')) {
    const x = e.target.closest('[data-toggle]').dataset.toggle;
    const arr = Array.isArray(state.answers[step.key]) ? [...state.answers[step.key]] : [];
    arr.includes(x) ? arr.splice(arr.indexOf(x), 1) : arr.push(x);
    state.answers[step.key] = arr;
    save();
    renderPlanner();
  }
  
  if (e.target.closest('[data-answer]')) {
    const btn = e.target.closest('[data-answer]');
    const ok = Number(btn.dataset.answer) === state.quiz[state.quizIndex].c;
    btn.classList.add(ok ? 'correct' : 'wrong');
    btn.disabled = true;
    setTimeout(() => {
      if (ok) {
        state.quizIndex++;
        state.quizIndex < 12 ? renderQuiz() : show('success');
      } else {
        show('fail');
      }
    }, 800);
  }
  
  if (!a) return;
  
  if (a === 'start') show('planner');
  if (a === 'back') {
    state.plannerIndex = Math.max(0, state.plannerIndex - 1);
    state.plannerIndex === 0 ? show('intro') : renderPlanner();
  }
  if (a === 'prevPlanner') {
    state.plannerIndex = Math.max(0, state.plannerIndex - 1);
    renderPlanner();
  }
  if (a === 'nextPlanner') {
    const step = planner[state.plannerIndex];
    if (step.type === 'text') {
      state.answers[step.key] = $('#textAnswer').value;
      save();
    }
    if (!isStepValid(step) && step.required) {
      toast('⚠️ Por favor completa este campo');
      return;
    }
    if (state.plannerIndex < planner.length - 1) {
      state.plannerIndex++;
      renderPlanner();
    } else {
      show('locked');
    }
  }
  if (a === 'startQuiz') {
    startQuiz();
    show('quiz');
  }
  if (a === 'exitQuiz') show('intro');
  if (a === 'retryQuiz') {
    startQuiz();
    show('quiz');
  }
  if (a === 'reviewPlan') {
    state.plannerIndex = 0;
    show('planner');
  }
  if (a === 'reserve') {
    sendEmail();
    show('ticket');
  }
  if (a === 'restart') {
    state.plannerIndex = 0;
    show('planner');
  }
  if (a === 'share') copySummary();
});

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

show('intro');
