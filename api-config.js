// API Configuration - Actualizar con URL de backend real
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Cambiar a URL real del backend
  TIMEOUT: 5000,
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',

    // Pedidos
    ORDERS: '/orders',
    ORDER_BY_ID: '/orders/:id',
    CREATE_ORDER: '/orders',
    UPDATE_ORDER: '/orders/:id',
    DELETE_ORDER: '/orders/:id',

    // Productos
    PRODUCTS: '/products',
    PRODUCT_SEARCH: '/products/search',
    PRODUCT_BY_REF: '/products/:ref',

    // Estados y cambios
    ORDER_STATUS: '/orders/:id/status',
    ORDER_HISTORY: '/orders/:id/history',

    // Usuarios
    USERS: '/users',
    USER_PROFILE: '/users/profile',

    // Sedes
    BRANCHES: '/branches',
  }
};

// Helper para construir URLs
function buildUrl(endpoint, params = {}) {
  let url = API_CONFIG.ENDPOINTS[endpoint] || endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return API_CONFIG.BASE_URL + url;
}

// Clase para manejar llamadas API
class ApiClient {
  static async request(method, endpoint, data = null, params = {}) {
    const url = buildUrl(endpoint, params);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
      timeout: API_CONFIG.TIMEOUT,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  static get(endpoint, params = {}) {
    return this.request('GET', endpoint, null, params);
  }

  static post(endpoint, data, params = {}) {
    return this.request('POST', endpoint, data, params);
  }

  static put(endpoint, data, params = {}) {
    return this.request('PUT', endpoint, data, params);
  }

  static patch(endpoint, data, params = {}) {
    return this.request('PATCH', endpoint, data, params);
  }

  static delete(endpoint, params = {}) {
    return this.request('DELETE', endpoint, null, params);
  }
}
