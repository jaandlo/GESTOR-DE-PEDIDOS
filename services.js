// Services - Capa de lógica de negocio separada de UI
const DataService = {
  // ===== ÓRDENES =====
  async getOrders() {
    try {
      // Para desarrollo: retorna datos locales
      // Para producción: cambiar a ApiClient.get('ORDERS')
      return Promise.resolve(sampleOrders);
    } catch (error) {
      showToast('Error cargando pedidos');
      return [];
    }
  },

  async getOrderById(id) {
    try {
      const orders = await this.getOrders();
      return orders.find(o => o.id === id);
    } catch (error) {
      showToast('Error cargando pedido');
      return null;
    }
  },

  async createOrder(orderData) {
    try {
      // Backend: ApiClient.post('CREATE_ORDER', orderData)
      const newOrder = {
        id: 'PD-' + (1000 + sampleOrders.length + 1),
        ...orderData,
        status: 'Pendiente',
        history: [{ date: orderData.date, event: 'Pedido creado por ' + orderData.requester }],
      };
      sampleOrders.unshift(newOrder);
      this.saveOrdersLocal();
      return newOrder;
    } catch (error) {
      showToast('Error creando pedido');
      throw error;
    }
  },

  async updateOrderStatus(orderId, newStatus, note) {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) throw new Error('Pedido no encontrado');

      // Backend: ApiClient.patch('ORDER_STATUS', { status: newStatus }, { id: orderId })
      order.status = newStatus;
      order.history.push({
        date: new Date().toISOString().slice(0, 10),
        event: note || newStatus,
      });

      this.saveOrdersLocal();
      return order;
    } catch (error) {
      showToast('Error actualizando estado');
      throw error;
    }
  },

  async approveOrder(orderId, approvalData) {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) throw new Error('Pedido no encontrado');

      // Backend: ApiClient.post(`/orders/${orderId}/approve`, approvalData)
      order.items.forEach(item => {
        const approved = approvalData.items.find(a => a.ref === item.ref);
        if (approved) item.quantityApproved = approved.quantity;
      });

      const isPartial = order.items.some(i => i.quantityApproved < i.quantity);
      const event = isPartial ? 'Aprobación parcial' : 'Aprobado';

      return this.updateOrderStatus(orderId, 'Aprobado', event + (approvalData.notes ? ' — ' + approvalData.notes : ''));
    } catch (error) {
      showToast('Error aprobando pedido');
      throw error;
    }
  },

  async rejectOrder(orderId, reason) {
    try {
      // Backend: ApiClient.post(`/orders/${orderId}/reject`, { reason })
      return this.updateOrderStatus(orderId, 'Rechazado', 'Rechazado: ' + (reason || 'Sin justificación'));
    } catch (error) {
      showToast('Error rechazando pedido');
      throw error;
    }
  },

  async dispatchOrder(orderId) {
    try {
      // Backend: ApiClient.post(`/orders/${orderId}/dispatch`, {})
      return this.updateOrderStatus(orderId, 'Despachado', 'Pedido enviado a despacho');
    } catch (error) {
      showToast('Error despachando pedido');
      throw error;
    }
  },

  async receiveOrder(orderId) {
    try {
      // Backend: ApiClient.post(`/orders/${orderId}/receive`, {})
      return this.updateOrderStatus(orderId, 'Recibido', 'Recepción confirmada en sede');
    } catch (error) {
      showToast('Error confirmando recepción');
      throw error;
    }
  },

  // ===== PRODUCTOS =====
  async getProducts() {
    try {
      // Backend: ApiClient.get('PRODUCTS')
      return Promise.resolve(productCatalog);
    } catch (error) {
      showToast('Error cargando productos');
      return [];
    }
  },

  async searchProducts(query) {
    try {
      const products = await this.getProducts();
      return products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.ref.toLowerCase().includes(query)
      );
      // Backend: ApiClient.get('PRODUCT_SEARCH', { q: query })
    } catch (error) {
      showToast('Error buscando productos');
      return [];
    }
  },

  // ===== AUTENTICACIÓN =====
  async login(username, branch, role) {
    try {
      // Backend: ApiClient.post('LOGIN', { username, branch, role })
      const user = { name: username, branch, role };
      localStorage.setItem('current_user', JSON.stringify(user));
      return user;
    } catch (error) {
      showToast('Error en autenticación');
      throw error;
    }
  },

  async logout() {
    try {
      // Backend: ApiClient.post('LOGOUT', {})
      localStorage.removeItem('current_user');
      localStorage.removeItem('auth_token');
      return true;
    } catch (error) {
      showToast('Error al cerrar sesión');
      throw error;
    }
  },

  // ===== PERSISTENCIA LOCAL (para desarrollo) =====
  saveOrdersLocal() {
    try {
      localStorage.setItem('gestor_pedidos', JSON.stringify(sampleOrders));
    } catch (e) {
      console.warn('localStorage no disponible:', e);
    }
  },

  loadOrdersLocal() {
    try {
      const saved = localStorage.getItem('gestor_pedidos');
      if (saved) {
        const parsed = JSON.parse(saved);
        sampleOrders.length = 0;
        parsed.forEach(o => sampleOrders.push(o));
      }
    } catch (e) {
      console.warn('Error cargando pedidos:', e);
    }
  },
};
