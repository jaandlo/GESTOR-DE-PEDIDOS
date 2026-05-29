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
  // Ocultar el botón de logout cuando se muestre la pantalla de login
  if (typeof logoutBtn !== 'undefined' && logoutBtn) {
    logoutBtn.style.display = screenId === 'screen-login' ? 'none' : 'inline-flex';
  }
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
  const branch = appState.currentUser?.branch || 'Sede Central';
  const orders = sampleOrders.filter((order) => order.branch === branch);

  sedeOrdersTable.innerHTML = orders
    .slice(0, 5)
    .map(
      (order) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.branch}</td>
        <td>${order.product}</td>
        <td>${order.status}</td>
        <td>${order.urgency}</td>
      </tr>`
    )
    .join('');
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

  const filtered = sampleOrders.filter((order) => {
    const statusMatch = statusFilter === 'Todos' || order.status === statusFilter;
    const branchMatch = order.branch.toLowerCase().includes(branchFilter);
    return statusMatch && branchMatch;
  });

  bodegaOrdersTable.innerHTML = filtered
    .map(
      (order) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.branch}</td>
        <td>${order.product}</td>
        <td>${order.status}</td>
        <td><button class="btn btn-secondary" data-order-id="${order.id}">Ver</button></td>
      </tr>`
    )
    .join('');
}

function updateOrderSummary() {
  orderSummary.innerHTML = summaryItems
    .map(
      (item) => `<li><span>${item.product}</span><strong>${item.quantity} uds</strong></li>`
    )
    .join('');
  summaryCount.textContent = summaryItems.length;
}

function renderOrderDetail(orderId) {
  const order = getOrderById(orderId);
  if (!order) return;

  appState.selectedOrderId = order.id;

  detailId.textContent = order.id;
  detailBranch.textContent = order.branch;
  detailRequester.textContent = order.requester;
  detailStatusBadge.textContent = order.status;
  detailStatusBadge.className = `badge ${getStatusClass(order.status)}`;
  detailUrgency.textContent = order.urgency;
  detailDate.textContent = formatDate(order.date);
  detailNotes.textContent = order.notes;

  detailProductList.innerHTML = `
    <li>${order.product} x ${order.quantity}</li>
  `;

  detailHistoryTimeline.innerHTML = order.history
    .map(
      (item) => `
      <li>
        <strong>${formatDate(item.date)}</strong>
        <p>${item.event}</p>
      </li>`
    )
    .join('');

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
  approveOrderBtn.style.display = 'none';
  rejectOrderBtn.style.display = 'none';
  dispatchOrderBtn.style.display = 'none';
  receiveOrderBtn.style.display = 'none';

  if (status === 'Pendiente' || status === 'En revisión') {
    approveOrderBtn.style.display = 'inline-flex';
    rejectOrderBtn.style.display = 'inline-flex';
  }

  if (status === 'Aprobado') {
    dispatchOrderBtn.style.display = 'inline-flex';
    rejectOrderBtn.style.display = 'inline-flex';
  }

  if (status === 'Despachado') {
    receiveOrderBtn.style.display = 'inline-flex';
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

  const product = document.getElementById('productSelect').value;
  const quantity = Number(document.getElementById('productQuantity').value);
  const branch = document.getElementById('orderBranch').value;
  const requester = document.getElementById('orderRequester').value.trim();
  const date = document.getElementById('orderDate').value;
  const notes = document.getElementById('orderNotes').value.trim();

  if (quantity < 1) {
    alert('La cantidad debe ser al menos 1.');
    return;
  }

  if (!requester || !date) {
    alert('Completa todos los campos del pedido.');
    return;
  }

  const newOrder = {
    id: `PD-${1000 + sampleOrders.length + 1}`,
    branch,
    requester,
    product,
    quantity,
    status: 'Pendiente',
    urgency: quantity > 20 ? 'Alta' : 'Media',
    date,
    notes: notes || 'Sin observaciones',
    history: [
      { date, event: `Pedido creado por ${requester}` },
    ],
  };

  sampleOrders.unshift(newOrder);
  summaryItems.push({ product, quantity, branch });

  updateOrderSummary();
  renderBodegaOrders();
  renderDashboardStats();
  renderNotifications();
  orderForm.reset();
  document.getElementById('orderBranch').value = branch;

  if (appState.currentUser?.role !== 'Encargado de Bodega') {
    showScreen('dashboard-sede');
  }
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

approveOrderBtn.addEventListener('click', () => {
  const note = decisionNotes.value.trim();
  updateOrderStatus(appState.selectedOrderId, 'Aprobado', note);
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
