# GUÍA DE IMPLEMENTACIÓN - GESTOR DE PEDIDOS

## 1. ESTRUCTURA DEL PROYECTO

```
GESTOR DE PEDIDOS/
├── index.html              # Interfaz UI
├── app.js                  # Lógica principal de UI
├── api-config.js           # Configuración de API
├── services.js             # Servicios de datos
├── styles.css              # Estilos CSS
├── API_SPECIFICATION.js    # Especificación de endpoints
└── README_BACKEND.md       # Esta guía
```

## 2. ARCHIVO DE CONFIGURACIÓN (api-config.js)

Este archivo define:
- **BASE_URL**: URL del servidor backend (actualmente http://localhost:3000/api)
- **ENDPOINTS**: Rutas de todos los endpoints de la API
- **ApiClient**: Clase para hacer solicitudes HTTP con autenticación

**Para cambiar a backend real:**
```javascript
const API_CONFIG = {
  BASE_URL: 'https://tu-backend.com/api',
  // ...
};
```

## 3. SERVICIOS (services.js)

Los servicios abstraen la lógica de datos:
- `DataService.getOrders()` - Obtiene lista de pedidos
- `DataService.getOrderById(id)` - Obtiene pedido específico
- `DataService.createOrder(data)` - Crea nuevo pedido
- `DataService.updateOrderStatus(id, status, note)` - Actualiza estado
- `DataService.approveOrder(id, approvalData)` - Aprueba pedido
- `DataService.rejectOrder(id, reason)` - Rechaza pedido
- `DataService.dispatchOrder(id)` - Despacha pedido
- `DataService.receiveOrder(id)` - Confirma recepción
- `DataService.getProducts()` - Obtiene catálogo de productos
- `DataService.searchProducts(query)` - Busca productos
- `DataService.login(username, branch, role)` - Autenticación
- `DataService.logout()` - Cierre de sesión

## 4. INTEGRACIÓN CON BACKEND

### Paso 1: Reemplazar datos mockeados

En `services.js`, cambiar:

```javascript
// DE:
async getOrders() {
  return Promise.resolve(sampleOrders);
}

// A:
async getOrders() {
  return ApiClient.get('ORDERS');
}
```

### Paso 2: Descomentar llamadas API

Cada función en `services.js` tiene comentarios indicando qué llamada API usar:

```javascript
async createOrder(orderData) {
  // Backend: ApiClient.post('CREATE_ORDER', orderData)
  // ...comentario con instrucción
}
```

### Paso 3: Implementar Backend

El backend debe implementar los endpoints definidos en `API_SPECIFICATION.js`

Ejemplo de respuesta esperada de `GET /orders`:
```json
[
  {
    "id": "PD-1001",
    "branch": "Sede Central",
    "requester": "Juan Pérez",
    "urgency": "Alta",
    "status": "Pendiente",
    "date": "2026-05-21",
    "notes": "Entrega urgente",
    "items": [
      {
        "ref": "EPP-001",
        "name": "Casco industrial",
        "unit": "und",
        "quantity": 12,
        "quantityApproved": 12,
        "obs": ""
      }
    ],
    "history": [
      {
        "date": "2026-05-21",
        "event": "Pedido creado por Juan Pérez"
      }
    ]
  }
]
```

## 5. AUTENTICACIÓN

### Token Bearer

El frontend envía token en header:
```javascript
'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
```

### Almacenamiento de token

Después del login, guardar:
```javascript
localStorage.setItem('auth_token', response.token);
localStorage.setItem('current_user', JSON.stringify(response.user));
```

## 6. MANEJO DE ERRORES

El frontend captura errores y muestra toasts:
```javascript
try {
  const order = await DataService.getOrderById(id);
} catch (error) {
  showToast('Error cargando pedido');
}
```

El backend debe retornar errores en este formato:
```json
{
  "error": "Not Found",
  "message": "El pedido PD-1001 no existe",
  "code": "ORDER_NOT_FOUND"
}
```

## 7. DESARROLLO LOCAL

### Servidor Frontend (ya corriendo):
```bash
python -m http.server 8000
# Acceso: http://localhost:8000
```

### Servidor Backend (necesario crear):
```bash
# Node.js + Express (ejemplo)
npm install express cors
node server.js
# Debe correr en http://localhost:3000
```

## 8. MODO DESARROLLO vs PRODUCCIÓN

### Desarrollo (datos mockeados):
- Los servicios retornan datos locales
- Cambiar `API_CONFIG.BASE_URL` a backend local
- Implementar solo algunos endpoints

### Producción (backend real):
- Descomentar todas las llamadas API
- Cambiar `API_CONFIG.BASE_URL` a servidor real
- Configurar CORS en backend
- Implementar autenticación completa

## 9. CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear servidor backend con Express/FastAPI/etc
- [ ] Implementar endpoint POST /auth/login
- [ ] Implementar endpoint GET /products
- [ ] Implementar endpoint GET /orders
- [ ] Implementar endpoint POST /orders
- [ ] Implementar endpoint PATCH /orders/:id/status
- [ ] Implementar endpoint POST /orders/:id/approve
- [ ] Implementar endpoint POST /orders/:id/reject
- [ ] Implementar endpoint POST /orders/:id/dispatch
- [ ] Implementar endpoint POST /orders/:id/receive
- [ ] Configurar CORS en backend
- [ ] Configurar base de datos
- [ ] Migrar de datos mockeados a API real
- [ ] Probar flujo completo login → crear pedido → aprobar
- [ ] Configurar despliegue en producción

## 10. VARIABLES DE ENTORNO

Backend debe leer de `.env`:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/gestor_pedidos
JWT_SECRET=tu_secreto_jwt
PORT=3000
CORS_ORIGIN=http://localhost:8000
NODE_ENV=development
```

## 11. CONTACTO Y SOPORTE

Para preguntas sobre integración:
- Revisar API_SPECIFICATION.js
- Consultar comentarios en services.js
- Verificar estructura de datos esperada en app.js

---
Última actualización: 2026-05-29
