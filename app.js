const screens = document.querySelectorAll('.screen');
const navLinks = document.querySelectorAll('.nav-link');
const loginForm = document.getElementById('loginForm');
const orderForm = document.getElementById('orderForm');
const orderSummary = document.getElementById('orderSummary');
const summaryCount = document.getElementById('summaryCount');
const sedeOrdersTable = document.getElementById('sedeOrdersTable');
const notificationsList = document.getElementById('notificationsList');
const bodegaOrdersTable = document.getElementById('bodegaOrdersTable');
const filterStatus = document.getElementById('filterStatus');
const filterBranch = document.getElementById('filterBranch');
const loginRole = document.getElementById('loginRole');
const statPending = document.getElementById('statPending');
const statReview = document.getElementById('statReview');
const statShipped = document.getElementById('statShipped');
const statNotifications = document.getElementById('statNotifications');
const detailId = document.getElementById('detailId');
const detailBranch = document.getElementById('detailBranch');
const detailRequester = document.getElementById('detailRequester');
const detailStatusBadge = document.getElementById('detailStatusBadge');
const detailUrgency = document.getElementById('detailUrgency');
const detailDate = document.getElementById('detailDate');
const detailNotes = document.getElementById('detailNotes');
const detailProductList = document.getElementById('detailProductList');
const detailHistoryTimeline = document.getElementById('detailHistoryTimeline');
const historyTimeline = document.getElementById('historyTimeline');
const decisionNotes = document.getElementById('decisionNotes');
const approveOrderBtn = document.getElementById('approveOrderBtn');
const rejectOrderBtn = document.getElementById('rejectOrderBtn');
const dispatchOrderBtn = document.getElementById('dispatchOrderBtn');
const receiveOrderBtn = document.getElementById('receiveOrderBtn');
const logoutBtn = document.getElementById('logoutBtn');

const productCatalog = [
  { ref: 'EPP-001', name: 'Casco industrial', unit: 'und', stock: 24 },
  { ref: 'EPP-045', name: 'Guantes de protección', unit: 'par', stock: 35 },
  { ref: 'EPP-078', name: 'Botas de seguridad', unit: 'par', stock: 8 },
  { ref: 'EPP-012', name: 'Chaqueta de trabajo', unit: 'und', stock: 15 },
  { ref: 'EPP-033', name: 'Gafas de protección', unit: 'und', stock: 42 },
  { ref: 'EPP-055', name: 'Mascarilla N95', unit: 'und', stock: 60 },
];

const sampleOrders = [
  {
    id: 'PD-1001',
    branch: 'Sede Central',
    requester: 'Juan Pérez',
    urgency: 'Alta',
    status: 'Pendiente',
    date: '2026-05-21',
    notes: 'Entrega urgente',
    items: [
      { ref: 'EPP-001', name: 'Casco industrial', unit: 'und', quantity: 12, quantityApproved: 12, obs: '' },
      { ref: 'EPP-033', name: 'Gafas de protección', unit: 'und', quantity: 12, quantityApproved: 12, obs: '' },
    ],
    history: [{ date: '2026-05-21', event: 'Pedido creado por Juan Pérez' }],
  },
  {
    id: 'PD-1002',
    branch: 'Sede Norte',
    requester: 'María López',
    urgency: 'Media',
    status: 'En revisión',
    date: '2026-05-19',
    notes: 'Verificar tallas disponibles',
    items: [
      { ref: 'EPP-045', name: 'Guantes de protección', unit: 'par', quantity: 25, quantityApproved: 25, obs: 'Talla M' },
      { ref: 'EPP-033', name: 'Gafas de protección', unit: 'und', quantity: 10, quantityApproved: 10, obs: '' },
    ],
    history: [
      { date: '2026-05-18', event: 'Pedido creado por Sede Norte' },
      { date: '2026-05-19', event: 'Bodega inició revisión' },
    ],
  },
  {
    id: 'PD-1003',
    branch: 'Sede Sur',
    requester: 'Carlos Díaz',
    urgency: 'Baja',
    status: 'Despachado',
    date: '2026-05-17',
    notes: 'Entrega al almacén sur',
    items: [
      { ref: 'EPP-078', name: 'Botas de seguridad', unit: 'par', quantity: 10, quantityApproved: 8, obs: '' },
    ],
    history: [
      { date: '2026-05-16', event: 'Pedido creado por Sede Sur' },
      { date: '2026-05-17', event: 'Pedido aprobado parcialmente — 8 de 10 pares disponibles' },
      { date: '2026-05-18', event: 'Pedido despachado' },
    ],
  },
  {
    id: 'PD-1004',
    branch: 'Sede Central',
    requester: 'Laura Sánchez',
    urgency: 'Alta',
    status: 'Pendiente',
    date: '2026-05-20',
    notes: 'Tallas mixtapes',
    items: [
      { ref: 'EPP-012', name: 'Chaqueta de trabajo', unit: 'und', quantity: 8, quantityApproved: 8, obs: '' },
      { ref: 'EPP-055', name: 'Mascarilla N95', unit: 'und', quantity: 50, quantityApproved: 50, obs: '' },
    ],
    history: [{ date: '2026-05-20', event: 'Pedido creado por Laura Sánchez' }],
  },
];

const notifications = [
  'Pedido PD-1002 requiere revisión adicional.',
  'Pedido PD-1003 fue despachado ayer.',
  'Sede Central solicita actualización de stock.',
];

const summaryItems = [];
const appState = {
  currentUser: null,
  selectedOrderId: null,
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.screen === screenId);
  });

  if (logoutBtn) {
    logoutBtn.style.display = screenId === 'screen-login' ? 'none' : 'inline-flex';
  }

  const role = appState.currentUser?.role;
  navLinks.forEach((link) => {
    if (!role) { link.style.display = 'none'; return; }
    const s = link.dataset.screen;
    const oculto =
      (s === 'dashboard-bodega' && role === 'Encargado de Sede') ||
      (s === 'dashboard-sede'   && role === 'Encargado de Bodega');
    link.style.display = oculto ? 'none' : '';
  });
}

function getOrderById(id) {
  return sampleOrders.find((order) => order.id === id);
}

function getStatusClass(status) {
  switch (status) {
    case 'Pendiente':
      return 'badge-warning';
    case 'En revisión':
      return 'badge-warning';
    case 'Aprobado':
      return 'badge-success';
    case 'Despachado':
      return 'badge-info';
    case 'Recibido':
      return 'badge-primary';
    case 'Rechazado':
      return 'badge-danger';
    default:
      return 'badge-warning';
  }
}

function renderDashboardStats() {
  const pending = sampleOrders.filter((order) => order.status === 'Pendiente').length;
  const review = sampleOrders.filter((order) => order.status === 'En revisión').length;
  const shipped = sampleOrders.filter((order) => order.status === 'Despachado').length;

  statPending.textContent = pending;
  statReview.textContent = review;
  statShipped.textContent = shipped;
  statNotifications.textContent = notifications.length;
}

function renderSedeOrders() {
  const branch = appState.currentUser?.branch || '';
  const role   = appState.currentUser?.role;
  const orders = role === 'Administrador'
    ? sampleOrders
    : sampleOrders.filter((o) => o.branch === branch);

  sedeOrdersTable.innerHTML = orders.slice(0, 5).map((order) => {
    const resumen = order.items.length + ' ref' + (order.items.length > 1 ? 's.' : '.');
    return `<tr>
      <td>${order.id}</td>
      <td>${order.branch}</td>
      <td>${resumen}</td>
      <td><span class="badge ${getStatusClass(order.status)}">${order.status}</span></td>
      <td>${order.urgency}</td>
    </tr>`;
  }).join('');
}

function renderNotifications() {
  const recentNotifications = [
    ...notifications,
    ...sampleOrders
      .filter((order) => order.status === 'Pendiente')
      .map((order) => `Pedido ${order.id} pendiente en ${order.branch}.`),
  ];

  notificationsList.innerHTML = recentNotifications
    .slice(0, 6)
    .map((note) => `<li>${note}</li>`)
    .join('');
}

function renderBodegaOrders() {
  const statusFilter = filterStatus.value;
  const branchFilter = filterBranch.value.toLowerCase();

  const filtered = sampleOrders.filter((o) => {
    const statusMatch = statusFilter === 'Todos' || o.status === statusFilter;
    const branchMatch = o.branch.toLowerCase().includes(branchFilter);
    return statusMatch && branchMatch;
  });

  bodegaOrdersTable.innerHTML = filtered.map((order) => {
    const resumen = order.items.length + ' ref' + (order.items.length > 1 ? 's.' : '.');
    const accion  = getInlineAction(order);
    return `<tr>
      <td>${order.id}</td>
      <td>${order.branch}</td>
      <td>${formatDate(order.date)}</td>
      <td>${resumen}</td>
      <td>${order.urgency}</td>
      <td><span class="badge ${getStatusClass(order.status)}">${order.status}</span></td>
      <td>${accion}</td>
    </tr>`;
  }).join('');
}

function getInlineAction(order) {
  const id = order.id;
  switch (order.status) {
    case 'Pendiente':
      return `<button class="btn btn-primary btn-sm" data-order-id="${id}">Revisar</button>`;
    case 'En revisión':
      return `<button class="btn btn-primary btn-sm" data-order-id="${id}">Continuar</button>`;
    case 'Aprobado':
      return `<button class="btn btn-success btn-sm" data-order-id="${id}">Despachar</button>`;
    default:
      return `<button class="btn btn-secondary btn-sm" data-order-id="${id}">Ver</button>`;
  }
}

function updateOrderSummary() {
  orderSummary.innerHTML = summaryItems
    .map(
      (item) => `<li><span>${item.product}</span><strong>${item.quantity} uds</strong></li>`
    )
    .join('');
  summaryCount.textContent = summaryItems.length;
}

let currentOrderItems = [];

function renderOrderItemsTable() {
  const tbody = document.getElementById('orderItemsTable');
  const count = document.getElementById('orderItemsCount');
  if (!tbody) return;

  tbody.innerHTML = currentOrderItems.map((item, idx) => `
    <tr>
      <td>${item.ref}</td>
      <td>${item.name}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}"
          style="width:60px; padding:4px 8px; border-radius:8px;"
          onchange="currentOrderItems[${idx}].quantity = Math.max(1, +this.value);" />
      </td>
      <td>
        <input type="text" value="${item.obs}" placeholder="—"
          style="width:90px; padding:4px 8px; border-radius:8px;"
          onchange="currentOrderItems[${idx}].obs = this.value;" />
      </td>
      <td>
        <button onclick="removeOrderItem(${idx})"
          style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:1rem;">✕</button>
      </td>
    </tr>`
  ).join('');

  if (count) {
    const total = currentOrderItems.reduce((s, i) => s + i.quantity, 0);
    count.textContent = currentOrderItems.length + ' producto' +
      (currentOrderItems.length !== 1 ? 's' : '') + ' — ' + total + ' unidades en total';
  }
}

function removeOrderItem(idx) {
  currentOrderItems.splice(idx, 1);
  renderOrderItemsTable();
}

function addProductToOrder(ref) {
  const product = productCatalog.find((p) => p.ref === ref);
  if (!product) return;
  if (currentOrderItems.find((i) => i.ref === ref)) {
    alert('Ese producto ya está en el pedido.'); return;
  }
  currentOrderItems.push({
    ref: product.ref, name: product.name,
    unit: product.unit, quantity: 1,
    quantityApproved: 1, obs: '',
  });
  renderOrderItemsTable();
  const searchEl = document.getElementById('productSearch');
  const resultsEl = document.getElementById('productSearchResults');
  if (searchEl)  searchEl.value = '';
  if (resultsEl) resultsEl.innerHTML = '';
}

function renderOrderDetail(orderId) {
  const order = getOrderById(orderId);
  if (!order) return;
  appState.selectedOrderId = order.id;

  detailId.textContent           = order.id;
  detailBranch.textContent       = order.branch;
  detailRequester.textContent    = order.requester;
  detailUrgency.textContent      = order.urgency;
  detailDate.textContent         = formatDate(order.date);
  detailNotes.textContent        = order.notes;
  detailStatusBadge.textContent  = order.status;
  detailStatusBadge.className    = 'badge ' + getStatusClass(order.status);

  const approvalBody = document.getElementById('approvalItemsBody');
  if (approvalBody) {
    approvalBody.innerHTML = order.items.map((item) => {
      const catalogItem = productCatalog.find((p) => p.ref === item.ref);
      const stock       = catalogItem ? catalogItem.stock : '—';
      const stockClass  = (typeof stock === 'number' && stock < item.quantity)
        ? 'color:var(--danger)' : 'color:var(--success)';
      return `<tr>
        <td>${item.ref}</td>
        <td>${item.name}</td>
        <td>${item.quantity} ${item.unit}</td>
        <td>
          <input type="number" class="approve-qty" data-ref="${item.ref}"
            min="0" max="${item.quantity}" value="${item.quantityApproved}"
            style="width:65px; padding:4px 8px; border-radius:8px;" />
        </td>
        <td style="${stockClass}; font-size:0.82rem;">${stock} disp.</td>
      </tr>`;
    }).join('');
  }

  detailProductList.innerHTML = order.items.map((item) =>
    `<li>${item.ref} — ${item.name} x ${item.quantity} ${item.unit}</li>`
  ).join('');

  detailHistoryTimeline.innerHTML = order.history.map((item) => `
    <li>
      <span class="timeline-dot"></span>
      <div><strong>${formatDate(item.date)}</strong><p>${item.event}</p></div>
    </li>`
  ).join('');

  decisionNotes.value = '';
  updateActionButtons(order.status);
  showScreen('detalle-pedido');
}

function renderHistorial() {
  const events = sampleOrders
    .flatMap((order) =>
      order.history.map((item) => ({
        ...item,
        orderId: order.id,
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  historyTimeline.innerHTML = events
    .map(
      (item) => `
      <li>
        <span class="timeline-dot"></span>
        <div>
          <strong>${formatDate(item.date)}</strong>
          <p>${item.orderId} - ${item.event}</p>
        </div>
      </li>`
    )
    .join('');
}

function updateActionButtons(status) {
  [approveOrderBtn, rejectOrderBtn, dispatchOrderBtn,
   receiveOrderBtn, reviewOrderBtn, cancelOrderBtn].forEach((b) => {
    if (b) b.style.display = 'none';
  });

  const role = appState.currentUser?.role;

  if (role === 'Encargado de Bodega') {
    if (status === 'Pendiente') {
      if (reviewOrderBtn)  reviewOrderBtn.style.display  = 'inline-flex';
      if (rejectOrderBtn)  rejectOrderBtn.style.display  = 'inline-flex';
    }
    if (status === 'En revisión') {
      if (approveOrderBtn) approveOrderBtn.style.display = 'inline-flex';
      if (rejectOrderBtn)  rejectOrderBtn.style.display  = 'inline-flex';
    }
    if (status === 'Aprobado') {
      if (dispatchOrderBtn) dispatchOrderBtn.style.display = 'inline-flex';
    }
  }

  if (role === 'Encargado de Sede') {
    if (status === 'Despachado') {
      if (receiveOrderBtn) receiveOrderBtn.style.display = 'inline-flex';
    }
    if (status === 'Pendiente') {
      if (cancelOrderBtn) cancelOrderBtn.style.display = 'inline-flex';
    }
  }
}

function updateOrderStatus(orderId, status, note) {
  const order = getOrderById(orderId);
  if (!order) return;

  order.status = status;
  order.history.push({
    date: new Date().toISOString().slice(0, 10),
    event: `${status}${note ? ` - ${note}` : ''}`,
  });

  renderDashboardStats();
  renderSedeOrders();
  renderBodegaOrders();
  renderNotifications();
  renderHistorial();
  renderOrderDetail(orderId);
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const userName = document.getElementById('loginUser').value.trim();
  const userBranch = document.getElementById('loginSede').value;
  const role = loginRole.value;

  if (!userName) {
    alert('Por favor ingresa tu usuario.');
    return;
  }

  appState.currentUser = {
    name: userName,
    branch: userBranch,
    role,
  };

  if (role === 'Encargado de Bodega') {
    showScreen('dashboard-bodega');
  } else {
    showScreen('dashboard-sede');
  }

  renderDashboardStats();
  renderSedeOrders();
  renderBodegaOrders();
  renderNotifications();
  renderHistorial();
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const branch    = document.getElementById('orderBranch').value;
  const requester = document.getElementById('orderRequester').value.trim();
  const date      = document.getElementById('orderDate').value;
  const urgency   = document.getElementById('orderUrgency')?.value || 'Media';
  const notes     = document.getElementById('orderNotes').value.trim();

  if (!requester || !date) {
    alert('Completa todos los campos del pedido.'); return;
  }
  if (currentOrderItems.length === 0) {
    alert('Agrega al menos un producto al pedido.'); return;
  }

  const newOrder = {
    id: 'PD-' + (1000 + sampleOrders.length + 1),
    branch, requester, urgency,
    status: 'Pendiente',
    date,
    notes: notes || 'Sin observaciones',
    items: currentOrderItems.map((i) => ({ ...i })),
    history: [{ date, event: 'Pedido creado por ' + requester }],
  };

  sampleOrders.unshift(newOrder);
  saveOrders();
  currentOrderItems = [];
  renderOrderItemsTable();
  renderBodegaOrders();
  renderDashboardStats();
  renderSedeOrders();
  renderNotifications();
  orderForm.reset();

  const orderBranchInput = document.getElementById('orderBranch');
  if (orderBranchInput) orderBranchInput.value = branch;

  showScreen('dashboard-sede');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => showScreen(link.dataset.screen));
});

document.addEventListener('click', (event) => {
  const orderButton = event.target.closest('[data-order-id]');
  if (orderButton) {
    event.preventDefault();
    renderOrderDetail(orderButton.dataset.orderId);
    return;
  }

  const button = event.target.closest('[data-screen]');
  if (!button) return;
  const screen = button.dataset.screen;
  if (screen) {
    event.preventDefault();
    showScreen(screen);
  }
});

filterStatus.addEventListener('change', renderBodegaOrders);
filterBranch.addEventListener('input', renderBodegaOrders);

const productSearchEl = document.getElementById('productSearch');
if (productSearchEl) {
  productSearchEl.addEventListener('input', () => {
    const q       = productSearchEl.value.toLowerCase();
    const results = document.getElementById('productSearchResults');
    if (!results) return;
    if (q.length < 2) { results.innerHTML = ''; return; }

    const encontrados = productCatalog.filter((p) =>
      p.name.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q)
    );

    results.innerHTML = encontrados.map((p) => `
      <div style="display:flex; justify-content:space-between; align-items:center;
                  padding:8px 12px; background:var(--surface-strong);
                  border-radius:10px; margin-bottom:6px;">
        <span style="font-size:0.88rem;">
          <strong>${p.ref}</strong> — ${p.name}
          <span style="color:var(--text-muted); font-size:0.8rem;">
            (${p.unit} · ${p.stock} disponibles)
          </span>
        </span>
        <button class="btn btn-secondary" style="padding:6px 14px; font-size:0.82rem;"
          onclick="addProductToOrder('${p.ref}')">+ Agregar</button>
      </div>`
    ).join('') || '<p style="font-size:0.85rem; color:var(--text-muted);">Sin resultados.</p>';
  });
}

approveOrderBtn.addEventListener('click', () => {
  const note  = decisionNotes.value.trim();
  const order = getOrderById(appState.selectedOrderId);
  if (!order) return;

  document.querySelectorAll('.approve-qty').forEach((input) => {
    const item = order.items.find((i) => i.ref === input.dataset.ref);
    if (item) item.quantityApproved = Math.max(0, +input.value);
  });

  const esParciál = order.items.some((i) => i.quantityApproved < i.quantity);
  const evento    = esParciál
    ? 'Aprobación parcial' + (note ? ' — ' + note : '')
    : 'Aprobado' + (note ? ' — ' + note : '');

  updateOrderStatus(appState.selectedOrderId, 'Aprobado', evento);
});

rejectOrderBtn.addEventListener('click', () => {
  const note = decisionNotes.value.trim();
  updateOrderStatus(appState.selectedOrderId, 'Rechazado', note);
});

dispatchOrderBtn.addEventListener('click', () => {
  updateOrderStatus(appState.selectedOrderId, 'Despachado', 'Pedido enviado a despacho');
});

receiveOrderBtn.addEventListener('click', () => {
  updateOrderStatus(appState.selectedOrderId, 'Recibido', 'Recepción confirmada en sede');
});

function appInit() {
  renderDashboardStats();
  renderSedeOrders();
  renderNotifications();
  renderBodegaOrders();
  renderHistorial();
  updateOrderSummary();
}

appInit();

// Logout handler
function handleLogout() {
  appState.currentUser = null;
  appState.selectedOrderId = null;
  loginForm.reset();
  // Reset to login screen
  showScreen('screen-login');
  // Refresh views
  renderDashboardStats();
  renderSedeOrders();
  renderBodegaOrders();
  renderNotifications();
  renderHistorial();
  updateOrderSummary();
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', handleLogout);
}
