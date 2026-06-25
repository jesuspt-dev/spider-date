const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

let emailjsConfig = {
  publicKey: 'zl_ycJiJe3xEzX3kQ',
  serviceId: 'service_spider',
  templateId: 'template_spider'
};

const state = {
  screen: 'intro', plannerIndex: 0, quizIndex: 0,
  answers: JSON.parse(localStorage.getItem('spiderDateAnswers') || '{}'),
  quiz: []
};
const planner = [
  {key:'saludo', title:'¿Cómo quieres que te salude cuando te vea?', hint:'El protocolo de bienvenida es importante.', type:'single', options:[['💋','Beso apasionado'],['🍑','Cachetada en el [...'],['🤝','Apretón de manos'],['😘','Beso en la mejilla']]},
  {key:'comida', title:'¿Dónde comemos antes de la peli?', hint:'Elige sin presión. Mentira: sushi suma puntos.', type:'singleCustom', options:[['🍣','Kaisen'],['🍱','Sushi O'],['🥩','Bar de carnes'],['🍝','Italiano']]},
  {key:'peli', title:'¿Qué película vemos?', hint:'Pregunta trampa, pero queda bonito preguntarlo.', type:'single', options:[['🕷️','Spider-Man: Brand New Day'],['🕸️','Spider-Man: Across the Spider-Verse'],['🎬','Lo que elijas tú'],['🍿','Sorpresa']]},
  {key:'outfit', title:'Outfit oficial de la cita', hint:'Elige el mood. Se respetará con solemnidad.', type:'single', options:[['✨','Elegante'],['👕','Casual guapa'],['🕷️','Cosplay de Spider-Man'],['😎','Lo que salga']]},
  {key:'flores', title:'¿Qué flores quieres en tu ramo?', hint:'Puedes elegir varias y añadir las que falten.', type:'multiCustom', options:[['🌹','Rosas'],['🌷','Tulipanes'],['🌻','Girasoles'],['🌸','Cerezos']]},
  {key:'postre', title:'Postre después de comer', hint:'También vale robarme el mío.', type:'singleCustom', options:[['🍨','Helado'],['🍰','Tarta'],['🧇','Gofre'],['🍫','Chocolate'],['🍓','Fresas']]},
  {key:'bebida', title:'Bebida del plan', hint:'Para comer, para después o para fingir que somos adultos funcionales.', type:'singleCustom', options:[['🍹','Cóctel'],['🍷','Vino'],['🥤','Refresco'],['☕','Café']]},
  {key:'extras', title:'Extras desbloqueables', hint:'Puedes seleccionar todos los que quieras.', type:'multi', options:[['🚶‍♀️','Paseo'],['📸','Fotos juntos'],['🎮','Arcade'],['🌃','Atardecer'],['🎵','Música en vivo']]},
  {key:'mensaje', title:'Mensaje secreto antes de la cita', hint:'Última oportunidad para añadir condiciones, amenazas o indirectas.', type:'text'}
];
const bank = [
  {d:'Fácil', q:'¿Qué representa el activo en el balance?', a:['Bienes, derechos y otros recursos controlados por la empresa','Sólo las deudas con bancos','Sólo el dinero en caja','Las aportaciones de los socios'], c:0},
  {d:'Fácil', q:'La ecuación básica del patrimonio es:', a:['Activo = Pasivo + Patrimonio neto','Pasivo = Activo + Patrimonio neto','Ingresos = Gastos + Activo','Activo = Gastos - Ingresos'], c:0},
  {d:'Fácil', q:'Una amortización contable recoge principalmente:', a:['La pérdida sistemática de valor de un inmovilizado por uso o tiempo','El pago de una deuda','La compra de existencias','Una retención a trabajadores'], c:0},
  {d:'Fácil', q:'La cuenta 572 Bancos c/c pertenece normalmente a:', a:['Activo corriente','Patrimonio neto','Pasivo no corriente','Gastos financieros'], c:0},
  {d:'Media', q:'Si una empresa compra acciones de otra sin intención especulativa a corto plazo, normalmente se clasificarían como:', a:['Activo financiero no destinado a negociar','Existencias','Deuda financiera','Inmovilizado intangible'], c:0},
  {d:'Media', q:'El principio de devengo implica que:', a:['Los ingresos y gastos se registran cuando ocurren, no necesariamente cuando se cobran o pagan','Todo se registra al cobrar','Sólo se reconocen gastos reales','Los ingresos sólo al facturar'], c:0},
  {d:'Media', q:'Una diferencia temporaria imponible suele originar:', a:['Un pasivo por impuesto diferido','Un activo por impuesto diferido','Una reserva voluntaria','Una pérdida irreversible'], c:0},
  {d:'Media', q:'El deterioro de valor de un activo se reconoce cuando:', a:['Su valor contable supera su importe recuperable','Su precio de compra sube','Se amortiza totalmente','La empresa obtiene beneficios'], c:0},
  {d:'Difícil', q:'En el método del coste amortizado, el tipo de interés efectivo sirve para:', a:['Distribuir financieramente ingresos o gastos durante la vida del instrumento','Calcular únicamente intereses simples','Determinar amortizaciones fiscales','Establecer provisiones'], c:0},
  {d:'Difícil', q:'En una subvención de capital para financiar inmovilizado, su imputación a resultados normalmente se realiza:', a:['En proporción a la amortización del activo financiado','Totalmente en el ejercicio de obtención','Mediante una reserva de patrimonio neto','Al vender el inmovilizado'], c:0},
  {d:'Difícil', q:'Si la amortización fiscal es mayor que la contable en el ejercicio, se genera inicialmente:', a:['Una diferencia temporaria que revierte en ejercicios futuros','Un ingreso extraordinario permanente','Una pérdida contable irreversible','Un crédito fiscal sin límite'], c:0},
  {d:'Difícil', q:'En un arrendamiento financiero para el arrendatario, si se transfieren sustancialmente riesgos y beneficios, se reconoce generalmente:', a:['Un activo por derecho de uso o inmovilizado y un pasivo de arrendamiento','Un gasto de arrendamiento en el resultado','Una opción contingente','Un pago al contado'], c:0},
  {d:'Fácil', q:'Las existencias son normalmente:', a:['Activo corriente','Pasivo corriente','Patrimonio neto','Inmovilizado intangible siempre'], c:0},
  {d:'Media', q:'El valor razonable se define como:', a:['Precio que se recibiría por vender un activo o se pagaría por transferir un pasivo en una transacción ordenada','Precio histórico sin ajustes','Valor contable neto después de amortizaciones','Precio negociado entre partes relacionadas'], c:0},
  {d:'Difícil', q:'Una provisión se reconoce cuando existe:', a:['Obligación presente, salida probable de recursos y estimación fiable','Una posibilidad remota sin estimación','Un beneficio futuro seguro','Una oportunidad de inversión'], c:0}
];

// Inicializar EmailJS
emailjs.init(emailjsConfig.publicKey);

function save(){localStorage.setItem('spiderDateAnswers', JSON.stringify(state.answers));}
function show(name){state.screen=name; $$('.screen').forEach(s=>s.classList.toggle('active',s.dataset.screen===name)); if(name==='planner') renderPlanner(); if(name==='success') renderSummary();}
function toast(t){const el=$('#toast'); el.textContent=t; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200)}

function renderPlanner(){
  const step=planner[state.plannerIndex], val=state.answers[step.key]; 
  $('#plannerStep').textContent=state.plannerIndex+1; 
  $('#plannerProgress').style.width=`${((state.plannerIndex+1)/planner.length)*100}%`;
  let html=`<div class="planner-card"><p class="eyebrow">${step.hint}</p><h3>${step.title}</h3>`;
  if(['single','singleCustom'].includes(step.type)){html+=`<div class="option-grid">${step.options.map(o=>`<button class="option ${val===o[1]?'selected':''}" data-select="${o[1]}"><span class="emoji">${o[0]}</span><span class="text">${o[1]}</span></button>`).join('')}</div>`}
  if(['multi','multiCustom'].includes(step.type)){const selected=Array.isArray(val)?val:[]; html+=`<div class="chip-area">${step.options.map(o=>`<button class="chip ${selected.includes(o[1])?'selected':''}" data-toggle="${o[1]}"><span>${o[0]} ${o[1]}</span></button>`).join('')}</div>`}
  if(step.type==='text') html+=`<textarea class="textarea" id="textAnswer" placeholder="Escribe aquí...">${val||''}</textarea>`;
  html+=`<div class="nav-row"><button class="ghost" data-action="prevPlanner">Atrás</button><button class="primary" data-action="nextPlanner">${state.plannerIndex===planner.length-1?'Bloquear cita':'Siguiente'}</button></div></div>`;
  $('#plannerContent').innerHTML=html;
}

function startQuiz(){state.quiz=[...bank].sort(()=>Math.random()-.5).sort((a,b)=>['Fácil','Media','Difícil'].indexOf(a.d)-['Fácil','Media','Difícil'].indexOf(b.d)).slice(0,12); state.quizIndex=0; renderQuiz();}

function renderQuiz(){
  const q=state.quiz[state.quizIndex]; 
  $('#quizStep').textContent=state.quizIndex+1; 
  $('#quizProgress').style.width=`${((state.quizIndex+1)/12)*100}%`; 
  $('#difficultyLabel').textContent=`Nivel ${q.d.toLowerCase()}`;
  let html=`<div class="question">${q.q}</div><div class="answers">`;
  html+=q.a.map((a,i)=>`<button class="answer-btn" data-answer="${i}">${a}</button>`).join('');
  html+=`</div>`;
  $('#quizContent').innerHTML=html;
}

function renderSummary(){
  const map={saludo:'Saludo',comida:'Comida',peli:'Película',outfit:'Outfit',flores:'Flores',postre:'Postre',bebida:'Bebida',extras:'Extras',mensaje:'Mensaje secreto'}; 
  let html='';
  Object.entries(state.answers).forEach(([k,v])=>{if(map[k]) html+=`<p><strong>${map[k]}:</strong> ${Array.isArray(v)?v.join(', '):v}</p>`});
  $('#summary').innerHTML=html;
}

function sendEmail(){
  toast('📧 Enviando email...');
  
  const answerText = Object.entries(state.answers)
    .map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(', '):v}`)
    .join('\n');
  
  const templateParams = {
    to_email: 'raviolink12@gmail.com',
    subject: 'Spider-Date: Cita desbloqueada para el 29 de Julio 🕷️',
    message: `¡Hola!\n\nCita confirmada para el 29 de Julio\n\nDetalles planificados:\n\n${answerText}\n\n¡Que disfrutes! 🎉`
  };
  
  emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, templateParams)
    .then(response => {
      console.log('Email enviado:', response);
      toast('✓ ¡Email enviado correctamente!');
    })
    .catch(error => {
      console.error('Error al enviar email:', error);
      toast('✗ Error al enviar email');
    });
}

function copySummary(){
  const txt='Cita desbloqueada:\n'+Object.entries(state.answers).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):v}`).join('\n'); 
  navigator.clipboard?.writeText(txt); 
  toast('✓ Copiado al portapapeles')
}

document.addEventListener('click',e=>{
  const a=e.target.closest('[data-action]')?.dataset.action; 
  const step=planner[state.plannerIndex];
  
  if(e.target.closest('[data-select]')){
    state.answers[step.key]=e.target.closest('[data-select]').dataset.select; 
    save(); 
    renderPlanner();
  }
  
  if(e.target.closest('[data-toggle]')){
    const x=e.target.closest('[data-toggle]').dataset.toggle; 
    const arr=Array.isArray(state.answers[step.key])?[...state.answers[step.key]]:[];
    arr.includes(x)?arr.splice(arr.indexOf(x),1):arr.push(x);
    state.answers[step.key]=arr;
    save();
    renderPlanner();
  }
  
  if(e.target.closest('[data-answer]')){
    const btn=e.target.closest('[data-answer]'), ok=Number(btn.dataset.answer)===state.quiz[state.quizIndex].c; 
    btn.classList.add(ok?'correct':'wrong'); 
    setTimeout(()=>{if(ok){state.quizIndex++; state.quizIndex<12?renderQuiz():show('success')}else{show('fail')}},800);
  }
  
  if(!a)return;
  if(a==='start'){show('planner')}
  if(a==='back'){state.plannerIndex=Math.max(0,state.plannerIndex-1); state.plannerIndex===0?show('intro'):renderPlanner()}
  if(a==='prevPlanner'){state.plannerIndex=Math.max(0,state.plannerIndex-1); renderPlanner()}
  if(a==='nextPlanner'){
    const step=planner[state.plannerIndex];
    if(step.type==='text'){state.answers[step.key]=$('#textAnswer').value; save()}
    if(state.plannerIndex<planner.length-1){state.plannerIndex++; renderPlanner()}else{show('locked')}
  }
  if(a==='startQuiz'){startQuiz(); show('quiz')}
  if(a==='exitQuiz'){show('intro')}
  if(a==='retryQuiz'){startQuiz(); show('quiz')}
  if(a==='reviewPlan'){show('planner')}
  if(a==='reserve'){sendEmail(); show('ticket')}
  if(a==='restart'){show('planner'); state.plannerIndex=0; renderPlanner()}
  if(a==='share'){copySummary()}
});

if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
show('intro');
