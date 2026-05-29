/**
 * EJEMPLO DE SERVIDOR BACKEND - Express.js
 * Este archivo sirve como referencia para implementar el backend
 *
 * Instalar: npm install express cors dotenv jsonwebtoken
 * Ejecutar: npm start o npm run dev (con nodemon)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
  credentials: true
}));
app.use(express.json());

// ===== DATOS MOCKEADOS (Reemplazar con BD) =====
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
    ],
    history: [{ date: '2026-05-21', event: 'Pedido creado por Juan Pérez' }],
  }
];

const products = [
  { ref: 'EPP-001', name: 'Casco industrial', unit: 'und', stock: 24 },
  { ref: 'EPP-045', name: 'Guantes de protección', unit: 'par', stock: 35 },
  { ref: 'EPP-078', name: 'Botas de seguridad', unit: 'par', stock: 8 },
];

const users = [
  { id: 1, name: 'Juan', branch: 'Sede Central', role: 'Encargado de Sede' },
  { id: 2, name: 'María', branch: 'Sede Norte', role: 'Encargado de Bodega' },
];

// ===== MIDDLEWARE DE AUTENTICACIÓN =====
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no encontrado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ===== RUTAS DE AUTENTICACIÓN =====
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, branch, role } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Usuario requerido' });
    }

    const user = { id: 1, name: username, branch, role };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en autenticación' });
  }
});

app.post('/api/auth/logout', verifyToken, (req, res) => {
  // En una aplicación real, invalidar el token en la BD
  res.json({ success: true });
});

// ===== RUTAS DE PRODUCTOS =====
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/search', (req, res) => {
  const q = req.query.q?.toLowerCase() || '';
  const results = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.ref.toLowerCase().includes(q)
  );
  res.json(results);
});

app.get('/api/products/:ref', (req, res) => {
  const product = products.find(p => p.ref === req.params.ref);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
});

// ===== RUTAS DE PEDIDOS =====
app.get('/api/orders', verifyToken, (req, res) => {
  // Filtrar por rol y sede del usuario
  let filtered = sampleOrders;

  if (req.user.role === 'Encargado de Sede') {
    filtered = sampleOrders.filter(o => o.branch === req.user.branch);
  }

  const status = req.query.status;
  if (status && status !== 'Todos') {
    filtered = filtered.filter(o => o.status === status);
  }

  res.json(filtered);
});

app.get('/api/orders/:id', verifyToken, (req, res) => {
  const order = sampleOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }
  res.json(order);
});

app.post('/api/orders', verifyToken, (req, res) => {
  try {
    const { branch, requester, date, urgency, notes, items } = req.body;

    if (!branch || !requester || !date || items.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const newOrder = {
      id: 'PD-' + (1000 + sampleOrders.length + 1),
      branch,
      requester,
      urgency,
      status: 'Pendiente',
      date,
      notes: notes || 'Sin observaciones',
      items,
      history: [{ date, event: 'Pedido creado por ' + requester }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    sampleOrders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error creando pedido' });
  }
});

app.patch('/api/orders/:id/status', verifyToken, (req, res) => {
  try {
    const { status, note } = req.body;
    const order = sampleOrders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    order.status = status;
    order.history.push({
      date: new Date().toISOString().slice(0, 10),
      event: note || status
    });
    order.updatedAt = new Date();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando pedido' });
  }
});

app.post('/api/orders/:id/approve', verifyToken, (req, res) => {
  try {
    const order = sampleOrders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const { items, notes } = req.body;
    items.forEach(approved => {
      const item = order.items.find(i => i.ref === approved.ref);
      if (item) item.quantityApproved = approved.quantity;
    });

    order.status = 'Aprobado';
    order.history.push({
      date: new Date().toISOString().slice(0, 10),
      event: 'Aprobado' + (notes ? ' — ' + notes : '')
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error aprobando pedido' });
  }
});

app.post('/api/orders/:id/reject', verifyToken, (req, res) => {
  try {
    const order = sampleOrders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const { reason } = req.body;
    order.status = 'Rechazado';
    order.history.push({
      date: new Date().toISOString().slice(0, 10),
      event: 'Rechazado: ' + (reason || 'Sin justificación')
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error rechazando pedido' });
  }
});

app.post('/api/orders/:id/dispatch', verifyToken, (req, res) => {
  try {
    const order = sampleOrders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    order.status = 'Despachado';
    order.history.push({
      date: new Date().toISOString().slice(0, 10),
      event: 'Pedido enviado a despacho'
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error despachando pedido' });
  }
});

app.post('/api/orders/:id/receive', verifyToken, (req, res) => {
  try {
    const order = sampleOrders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    order.status = 'Recibido';
    order.history.push({
      date: new Date().toISOString().slice(0, 10),
      event: 'Recepción confirmada en sede'
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error confirmando recepción' });
  }
});

// ===== RUTAS DE USUARIO =====
app.get('/api/users/profile', verifyToken, (req, res) => {
  res.json(req.user);
});

// ===== MANEJO DE ERRORES =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📍 API disponible en http://localhost:${PORT}/api\n`);
});

module.exports = app;
