/**
 * ESPECIFICACIÓN DE API - GESTOR DE PEDIDOS
 * Backend Requirements
 *
 * Base URL: http://localhost:3000/api (cambiar en api-config.js)
 * Autenticación: Bearer Token en header "Authorization"
 */

// ====== AUTENTICACIÓN ======

/**
 * POST /auth/login
 * Request:
 * {
 *   "username": "string",
 *   "branch": "string (Sede Central|Sede Norte|Sede Sur)",
 *   "role": "string (Encargado de Sede|Encargado de Bodega|Administrador)"
 * }
 * Response:
 * {
 *   "token": "string",
 *   "user": { "id": "string", "name": "string", "branch": "string", "role": "string" }
 * }
 */

/**
 * POST /auth/logout
 * Headers: Authorization: Bearer <token>
 * Response: { "success": true }
 */

// ====== PRODUCTOS ======

/**
 * GET /products
 * Response:
 * [
 *   {
 *     "ref": "EPP-001",
 *     "name": "Casco industrial",
 *     "unit": "und",
 *     "stock": 24
 *   }
 * ]
 */

/**
 * GET /products/search?q=<query>
 * Response: [ {...productos filtrados} ]
 */

/**
 * GET /products/:ref
 * Response: { "ref": "EPP-001", "name": "...", "unit": "...", "stock": 24 }
 */

// ====== PEDIDOS (ORDERS) ======

/**
 * GET /orders
 * Query params:
 *   - status: "Pendiente|En revisión|Aprobado|Despachado|Recibido|Rechazado"
 *   - branch: "string" (filtrar por sede)
 *   - role: "string" (Encargado de Sede|Encargado de Bodega|Administrador)
 * Response:
 * [
 *   {
 *     "id": "PD-1001",
 *     "branch": "Sede Central",
 *     "requester": "Juan Pérez",
 *     "urgency": "Alta",
 *     "status": "Pendiente",
 *     "date": "2026-05-21",
 *     "notes": "string",
 *     "items": [
 *       {
 *         "ref": "EPP-001",
 *         "name": "Casco industrial",
 *         "unit": "und",
 *         "quantity": 12,
 *         "quantityApproved": 12,
 *         "obs": "string"
 *       }
 *     ],
 *     "history": [
 *       { "date": "2026-05-21", "event": "Pedido creado por Juan Pérez" }
 *     ],
 *     "createdAt": "2026-05-21T10:00:00Z",
 *     "updatedAt": "2026-05-21T10:00:00Z"
 *   }
 * ]
 */

/**
 * GET /orders/:id
 * Response: { ...order object }
 */

/**
 * POST /orders
 * Request:
 * {
 *   "branch": "Sede Central",
 *   "requester": "Juan Pérez",
 *   "date": "2026-05-21",
 *   "urgency": "Alta",
 *   "notes": "string",
 *   "items": [
 *     {
 *       "ref": "EPP-001",
 *       "name": "Casco industrial",
 *       "quantity": 12,
 *       "obs": "string"
 *     }
 *   ]
 * }
 * Response: { "id": "PD-1005", ...order object }
 */

/**
 * PATCH /orders/:id/status
 * Request: { "status": "En revisión", "note": "Recibido en bodega" }
 * Response: { ...updated order }
 */

/**
 * POST /orders/:id/approve
 * Request:
 * {
 *   "items": [
 *     { "ref": "EPP-001", "quantity": 12 }
 *   ],
 *   "notes": "Aprobado completo"
 * }
 * Response: { ...updated order with status "Aprobado" }
 */

/**
 * POST /orders/:id/reject
 * Request: { "reason": "Stock insuficiente" }
 * Response: { ...updated order with status "Rechazado" }
 */

/**
 * POST /orders/:id/dispatch
 * Response: { ...updated order with status "Despachado" }
 */

/**
 * POST /orders/:id/receive
 * Response: { ...updated order with status "Recibido" }
 */

/**
 * GET /orders/:id/history
 * Response:
 * [
 *   { "date": "2026-05-21", "event": "Pedido creado por Juan Pérez" },
 *   { "date": "2026-05-22", "event": "Enviado a revisión" }
 * ]
 */

// ====== USUARIOS ======

/**
 * GET /users/profile
 * Headers: Authorization: Bearer <token>
 * Response: { "id": "...", "name": "...", "branch": "...", "role": "..." }
 */

/**
 * GET /users
 * Response (solo admin):
 * [ { "id": "...", "name": "...", "branch": "...", "role": "..." } ]
 */

// ====== SEDES ======

/**
 * GET /branches
 * Response:
 * [
 *   { "id": "1", "name": "Sede Central" },
 *   { "id": "2", "name": "Sede Norte" },
 *   { "id": "3", "name": "Sede Sur" }
 * ]
 */

// ====== CÓDIGOS DE ERROR ======
/**
 * 400 Bad Request: Datos inválidos
 * 401 Unauthorized: Token inválido o expirado
 * 403 Forbidden: Usuario no tiene permiso
 * 404 Not Found: Recurso no encontrado
 * 409 Conflict: Stock insuficiente o conflicto de datos
 * 500 Internal Server Error: Error del servidor
 *
 * Response format:
 * { "error": "string", "message": "string", "code": "string" }
 */
