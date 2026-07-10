// ---- DADOS DA APLICAÇÃO (STATE) ----
let services = [
  { id: 's1', name: 'Corte Cabelo (Fade/Social)', price: 45.00, time: '35 min', icon: '✂️', cat: 'Cabelo', img: null },
  { id: 's2', name: 'Barba com Toalha Quente', price: 35.00, time: '25 min', icon: '🪒', cat: 'Barba', img: null },
  { id: 's3', name: 'Combo Corte + Barba', price: 70.00, time: '55 min', icon: '💈', cat: 'Combo', img: null },
  { id: 's4', name: 'Acabamento / Pezinho', price: 20.00, time: '15 min', icon: '📐', cat: 'Cabelo', img: null },
  { id: 's5', name: 'Sobrancelha Navalhada', price: 15.00, time: '10 min', icon: '✨', cat: 'Estética', img: null },
];

let stock = [
  { id: 'p1', name: 'Pomada Efeito Matte 100g', price: 48.00, qty: 14, min: 5, img: null },
  { id: 'p2', name: 'Óleo para Barba 30ml', price: 39.00, qty: 3, min: 5, img: null },
  { id: 'p3', name: 'Shampoo Fortificante 250ml', price: 52.00, qty: 8, min: 4, img: null },
  { id: 'p4', name: 'Pente de Madeira Maciça', price: 25.00, qty: 2, min: 3, img: null },
];

let timelineData = [
  { time: '09:00', client: 'Lucas Andrade', service: 'Combo Corte + Barba', status: 'feito' },
  { time: '10:00', client: 'Bruno Silva', service: 'Corte Cabelo', status: 'done' },
  { time: '11:00', client: 'Rafael Costa', service: 'Barba Toalha Quente', status: 'feito' },
  { time: '13:30', client: 'Felipe Nunes', service: 'Corte Cabelo (Fade)', status: 'pendente' },
  { time: '14:30', client: 'Marcos Vinícius', service: 'Combo Corte + Barba', status: 'pendente' },
  { time: '16:00', client: 'Otávio Prado', service: 'Acabamento + Sobrancelha', status: 'pendente' },
];

let queueData = [
  { name: 'Gabriel Souza', wait: '12 min', svc: 'Corte Cabelo' },
  { name: 'André Martins', wait: '28 min', svc: 'Barba' },
];

let salesHistory = [
  { id: '#1084', client: 'Rafael Costa', val: 'R$ 70,00', method: 'PIX', time: '11:32' },
  { id: '#1083', client: 'Lucas Andrade', val: 'R$ 70,00', method: 'Cartão', time: '09:45' },
];

let currentTicket = [];
let selectedPayMethod = 'card';

// ---- TROCA DE MODO (CLIENTE vs GESTOR) ----
function switchMode(mode) {
  const clientWrap = document.getElementById('clientView');
  const mgrWrap = document.getElementById('mgrView');
  const btnClient = document.getElementById('btnClient');
  const btnMgr = document.getElementById('btnMgr');

  if (mode === 'client') {
    clientWrap.style.display = 'flex';
    mgrWrap.style.display = 'none';
    btnClient.classList.add('active');
    btnMgr.classList.remove('active');
  } else {
    clientWrap.style.display = 'none';
    mgrWrap.style.display = 'flex';
    btnMgr.classList.add('active');
    btnClient.classList.remove('active');
  }
}

// ---- TROCA DE TABS DO PAINEL GESTOR ----
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.side-item').forEach(el => el.classList.remove('active'));

  const targetTab = document.getElementById('tab-' + tabId);
  if (targetTab) targetTab.style.display = 'block';

  event.currentTarget.classList.add('active');
}

// ---- RENDERIZAR CLIENTE ----
function renderClientView() {
  // Serviços
  const svcContainer = document.getElementById('clientSvcList');
  if (svcContainer) {
    svcContainer.innerHTML = services.map(s => `
      <div class="svc-card">
        <div class="svc-left">
          <div class="svc-icon">${s.icon}</div>
          <div>
            <div class="svc-name">${s.name}</div>
            <div class="svc-time">${s.time}</div>
          </div>
        </div>
        <div class="svc-price">R$ ${s.price.toFixed(2).replace('.', ',')}</div>
      </div>
    `).join('');
  }

  // Produtos
  const prodContainer = document.getElementById('clientProdList');
  if (prodContainer) {
    prodContainer.innerHTML = stock.map(p => `
      <div class="prod-card">
        <div class="prod-thumb">🧴</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
        <button class="prod-add" onclick="alert('Produto adicionado à sua lista!')">+ Adicionar</button>
      </div>
    `).join('');
  }

  // Dias Calendário
  const calContainer = document.getElementById('calDays');
  if (calContainer) {
    const days = [
      { dow: 'HOJE', num: '14' },
      { dow: 'TER', num: '15' },
      { dow: 'QUA', num: '16' },
      { dow: 'QUI', num: '17' },
      { dow: 'SEX', num: '18' },
      { dow: 'SÁB', num: '19' },
    ];
    calContainer.innerHTML = days.map((d, i) => `
      <div class="cal-day ${i === 0 ? 'active' : ''}">
        <div class="dow">${d.dow}</div>
        <div class="dnum">${d.num}</div>
      </div>
    `).join('');
  }

  // Slots de Horário
  const slotsContainer = document.getElementById('slotsGrid');
  if (slotsContainer) {
    const slots = [
      { t: '09:00', taken: true },
      { t: '10:00', taken: true },
      { t: '11:00', taken: true },
      { t: '13:30', taken: false },
      { t: '14:30', taken: false, selected: true },
      { t: '15:30', taken: false },
      { t: '16:30', taken: false },
      { t: '17:30', taken: false },
    ];
    slotsContainer.innerHTML = slots.map(s => `
      <div class="slot ${s.taken ? 'taken' : ''} ${s.selected ? 'selected' : ''}">${s.t}</div>
    `).join('');
  }
}

function scrollToSec(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ---- RENDERIZAR TIMELINE & FILA ----
function renderTimeline() {
  const container = document.getElementById('timelineList');
  if (!container) return;

  container.innerHTML = timelineData.map((t, index) => `
    <div class="tl-item ${t.status === 'done' || t.status === 'feito' ? 'done' : ''}">
      <div class="tl-row">
        <div class="tl-time">${t.time}</div>
        <div class="tl-info">
          <div class="tl-client">${t.client}</div>
          <div class="tl-svc">${t.service}</div>
        </div>
        <div class="tl-status ${t.status}">${t.status.toUpperCase()}</div>
        <div class="tl-check ${t.status === 'feito' || t.status === 'done' ? 'checked' : ''}" onclick="toggleStatus(${index})">
          ${t.status === 'feito' || t.status === 'done' ? '✓' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function toggleStatus(idx) {
  if (timelineData[idx].status === 'feito' || timelineData[idx].status === 'done') {
    timelineData[idx].status = 'pendente';
  } else {
    timelineData[idx].status = 'feito';
  }
  renderTimeline();
}

function renderQueue() {
  const container = document.getElementById('queueList');
  if (!container) return;

  container.innerHTML = queueData.map((q, i) => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:12.5px;">
      <div>
        <div style="font-weight:700;">${q.name}</div>
        <div style="font-size:11px; color:var(--text-faint);">${q.svc}</div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="mono" style="color:var(--brass-light); font-weight:600;">⏱️ ${q.wait}</span>
        <button class="icon-btn" onclick="removeQueue(${i})">✕</button>
      </div>
    </div>
  `).join('');
}

function addWalkIn() {
  const name = prompt('Nome do cliente walk-in:');
  if (name) {
    queueData.push({ name: name, wait: '15 min', svc: 'Atendimento Rápido' });
    renderQueue();
  }
}

function removeQueue(i) {
  queueData.splice(i, 1);
  renderQueue();
}

// ---- TABELA DE SERVIÇOS (EDITÁVEL + FOTOS) ----
function renderServicesTable() {
  const tbody = document.getElementById('svcTableBody');
  if (!tbody) return;

  tbody.innerHTML = services.map((s, idx) => `
    <tr>
      <td>
        <label class="photo-upload small" id="photo-svc-${s.id}" style="${s.img ? `background-image:url(${s.img})` : ''}">
          ${s.img ? '' : '+'}
          <input type="file" accept="image/*" onchange="uploadImage(event, 'svc', ${idx})">
        </label>
      </td>
      <td>
        ${s.editing ? `<input type="text" class="edit-input" value="${s.name}" onchange="services[${idx}].name=this.value">` : `<b>${s.name}</b>`}
      </td>
      <td><span class="svc-tag">${s.cat}</span></td>
      <td>${s.time}</td>
      <td class="mono">
        ${s.editing ? `<input type="number" class="edit-input" value="${s.price}" onchange="services[${idx}].price=parseFloat(this.value)">` : `R$ ${s.price.toFixed(2).replace('.', ',')}`}
      </td>
      <td>
        <button class="icon-btn" onclick="toggleEditService(${idx})">${s.editing ? '💾' : '✏️'}</button>
        <button class="icon-btn" onclick="deleteService(${idx})">🗑️</button>
      </td>
    </tr>
  `).join('');

  renderPosPicker();
  renderClientView();
}

function toggleEditService(idx) {
  services[idx].editing = !services[idx].editing;
  renderServicesTable();
}

function deleteService(idx) {
  services.splice(idx, 1);
  renderServicesTable();
}

function addServiceRow() {
  services.push({ id: 's' + (services.length + 1), name: 'Novo Serviço', price: 30.00, time: '20 min', icon: '✂️', cat: 'Geral', img: null, editing: true });
  renderServicesTable();
}

// ---- TABELA DE ESTOQUE (PRODUTOS) ----
function renderStockTable() {
  const tbody = document.getElementById('stockTableBody');
  if (!tbody) return;

  tbody.innerHTML = stock.map((p, idx) => `
    <tr>
      <td>
        <label class="photo-upload small" style="${p.img ? `background-image:url(${p.img})` : ''}">
          ${p.img ? '' : '+'}
          <input type="file" accept="image/*" onchange="uploadImage(event, 'prod', ${idx})">
        </label>
      </td>
      <td>
        ${p.editing ? `<input type="text" class="edit-input" value="${p.name}" onchange="stock[${idx}].name=this.value">` : `<b>${p.name}</b>`}
      </td>
      <td class="mono">
        ${p.editing ? `<input type="number" class="edit-input" value="${p.price}" onchange="stock[${idx}].price=parseFloat(this.value)">` : `R$ ${p.price.toFixed(2).replace('.', ',')}`}
      </td>
      <td class="mono">
        ${p.editing ? `<input type="number" class="edit-input" value="${p.qty}" onchange="stock[${idx}].qty=parseInt(this.value)">` : `${p.qty} un`}
      </td>
      <td>
        ${p.qty <= p.min ? `<span style="color:var(--danger); font-size:11px; font-weight:700;">⚠️ Estoque Baixo (Mín: ${p.min})</span>` : `<span style="color:var(--success); font-size:11px;">✓ Normal</span>`}
      </td>
      <td>
        <button class="icon-btn" onclick="toggleEditStock(${idx})">${p.editing ? '💾' : '✏️'}</button>
        <button class="icon-btn" onclick="deleteStock(${idx})">🗑️</button>
      </td>
    </tr>
  `).join('');

  renderPosPicker();
  renderClientView();
}

function toggleEditStock(idx) {
  stock[idx].editing = !stock[idx].editing;
  renderStockTable();
}

function deleteStock(idx) {
  stock.splice(idx, 1);
  renderStockTable();
}

function addStockRow() {
  stock.push({ id: 'p' + (stock.length + 1), name: 'Novo Produto', price: 20.00, qty: 10, min: 3, img: null, editing: true });
  renderStockTable();
}

// Upload simulado de Imagem
function uploadImage(e, type, idx) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    if (type === 'svc') services[idx].img = evt.target.result;
    if (type === 'prod') stock[idx].img = evt.target.result;
    renderServicesTable();
    renderStockTable();
  };
  reader.readAsDataURL(file);
}

// ---- FRENTE DE CAIXA (POS) LOGIC ----
function renderPosPicker() {
  const svcContainer = document.getElementById('posSvcPicker');
  const prodContainer = document.getElementById('posProdPicker');

  if (svcContainer) {
    svcContainer.innerHTML = services.map(s => `
      <div class="svc-chip" onclick="addToTicket('svc', '${s.id}')">
        <span>${s.icon} ${s.name}</span>
        <span class="p">R$ ${s.price.toFixed(2).replace('.', ',')}</span>
      </div>
    `).join('');
  }

  if (prodContainer) {
    prodContainer.innerHTML = stock.map(p => `
      <div class="svc-chip" onclick="addToTicket('prod', '${p.id}')">
        <span>🧴 ${p.name}</span>
        <span class="p">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
      </div>
    `).join('');
  }
}

function addToTicket(type, id) {
  if (type === 'svc') {
    const item = services.find(s => s.id === id);
    if (item) currentTicket.push({ type: 'svc', name: item.name, price: item.price });
  } else {
    const item = stock.find(p => p.id === id);
    if (item) currentTicket.push({ type: 'prod', name: item.name, price: item.price });
  }
  renderTicket();
}

function removeFromTicket(idx) {
  currentTicket.splice(idx, 1);
  renderTicket();
}

function renderTicket() {
  const container = document.getElementById('ticketLines');
  if (!container) return;

  if (currentTicket.length === 0) {
    container.innerHTML = '<div class="ticket-empty">Nenhum item adicionado à comanda.</div>';
  } else {
    container.innerHTML = currentTicket.map((item, idx) => `
      <div class="ticket-line">
        <span>${item.type === 'svc' ? '✂️' : '🧴'} ${item.name}</span>
        <div>
          <span class="mono">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
          <span class="remove" onclick="removeFromTicket(${idx})">✕</span>
        </div>
      </div>
    `).join('');
  }

  updatePosTotals();
}

function updatePosTotals() {
  let subSvc = currentTicket.filter(i => i.type === 'svc').reduce((a, b) => a + b.price, 0);
  let subProd = currentTicket.filter(i => i.type === 'prod').reduce((a, b) => a + b.price, 0);

  let discount = 0;
  if (selectedPayMethod === 'sub') {
    discount = subSvc; // Plano isenta serviços
  }

  const tip = parseFloat(document.getElementById('tipInput')?.value || 0);
  const total = Math.max(0, subSvc + subProd - discount + tip);

  if (document.getElementById('ttSvc')) document.getElementById('ttSvc').innerText = `R$ ${subSvc.toFixed(2).replace('.', ',')}`;
  if (document.getElementById('ttProd')) document.getElementById('ttProd').innerText = `R$ ${subProd.toFixed(2).replace('.', ',')}`;
  if (document.getElementById('ttDesc')) document.getElementById('ttDesc').innerText = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
  if (document.getElementById('ttTotal')) document.getElementById('ttTotal').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

  calcTroco();
}

function setPayMethod(method, btn) {
  selectedPayMethod = method;
  document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const cashBox = document.getElementById('payCashBox');
  const subBox = document.getElementById('paySubBox');

  if (cashBox) cashBox.style.display = method === 'cash' ? 'flex' : 'none';
  if (subBox) subBox.style.display = method === 'sub' ? 'block' : 'none';

  updatePosTotals();
}

function calcTroco() {
  if (selectedPayMethod !== 'cash') return;

  const totalStr = document.getElementById('ttTotal')?.innerText.replace('R$', '').replace('.', '').replace(',', '.').trim() || "0";
  const total = parseFloat(totalStr);
  const cashGiven = parseFloat(document.getElementById('cashGiven')?.value || 0);

  const troco = cashGiven - total;
  const display = document.getElementById('trocoDisplay');
  const val = document.getElementById('trocoVal');

  if (val) val.innerText = `R$ ${Math.abs(troco).toFixed(2).replace('.', ',')}`;
  if (display) {
    if (troco < 0) {
      display.classList.add('negative');
      display.childNodes[0].nodeValue = "Falta: ";
    } else {
      display.classList.remove('negative');
      display.childNodes[0].nodeValue = "Troco: ";
    }
  }
}

function