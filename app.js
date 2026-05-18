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
const filterButtons = document.querySelectorAll('[data-screen]');

const sampleOrders = [
  {
    id: 'PD-1001',
    client: 'Sede Central',
    product: 'Casco industrial',
    status: 'Pendiente',
    urgency: 'Alta',
  },
  {
    id: 'PD-1002',
    client: 'Sede Norte',
    product: 'Guantes de protección',
    status: 'En revisión',
    urgency: 'Media',
  },
  {
    id: 'PD-1003',
    client: 'Sede Sur',
    product: 'Botas de seguridad',
    status: 'Despachado',
    urgency: 'Baja',
  },
  {
    id: 'PD-1004',
    client: 'Sede Central',
    product: 'Chaqueta de trabajo',
    status: 'Pendiente',
    urgency: 'Alta',
  },
];

const notifications = [
  'Nuevo pedido pendiente de revisión en Sede Norte.',
  'Pedido PD-1003 ha sido despachado con éxito.',
  'Sede Central solicitó actualización de stock.',
];

const summaryItems = [];

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.screen === screenId);
  });
}

function renderSedeOrders() {
  sedeOrdersTable.innerHTML = sampleOrders
    .slice(0, 5)
    .map(
      (order) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.client}</td>
        <td>${order.product}</td>
        <td>${order.status}</td>
        <td>${order.urgency}</td>
      </tr>`
    )
    .join('');
}

function renderNotifications() {
  notificationsList.innerHTML = notifications
    .map((note) => `<li>${note}</li>`)
    .join('');
}

function renderBodegaOrders() {
  const statusFilter = filterStatus.value;
  const branchFilter = filterBranch.value.toLowerCase();

  const filtered = sampleOrders.filter((order) => {
    const statusMatch = statusFilter === 'Todos' || order.status === statusFilter;
    const branchMatch = order.client.toLowerCase().includes(branchFilter);
    return statusMatch && branchMatch;
  });

  bodegaOrdersTable.innerHTML = filtered
    .map(
      (order) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.client}</td>
        <td>${order.product}</td>
        <td>${order.status}</td>
        <td><button class="btn btn-secondary" data-screen="detalle-pedido">Ver</button></td>
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

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const userName = document.getElementById('loginUser').value.trim();
  const userBranch = document.getElementById('loginSede').value;
  const role = loginRole.value;

  if (!userName) {
    alert('Por favor ingresa tu usuario.');
    return;
  }

  if (role === 'Encargado de Bodega') {
    showScreen('dashboard-bodega');
  } else {
    showScreen('dashboard-sede');
  }
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const product = document.getElementById('productSelect').value;
  const quantity = Number(document.getElementById('productQuantity').value);
  const branch = document.getElementById('orderBranch').value;

  if (quantity < 1) {
    alert('La cantidad debe ser al menos 1.');
    return;
  }

  summaryItems.push({ product, quantity, branch });
  updateOrderSummary();
  orderForm.reset();
  document.getElementById('orderBranch').value = branch;
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => showScreen(link.dataset.screen));
});

document.addEventListener('click', (event) => {
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

appInit();

function appInit() {
  renderSedeOrders();
  renderNotifications();
  renderBodegaOrders();
  updateOrderSummary();
}
