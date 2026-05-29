# 📦 Gestor de Pedidos - Aplicación Web

Sistema integral de gestión de pedidos multi-sede con control de bodega en tiempo real.

## ✨ Características

- 🔐 **Autenticación multi-rol** - Encargado de Sede, Encargado de Bodega, Administrador
- 📊 **Dashboard interactivo** - Estadísticas en tiempo real
- 📝 **Creación de pedidos** - Búsqueda y selección de productos
- ✅ **Gestión de estado** - Pendiente → En revisión → Aprobado → Despachado → Recibido
- 📋 **Historial detallado** - Seguimiento completo de cambios
- 🏢 **Control multi-sede** - Gestión centralizada de múltiples sedes
- 💾 **Persistencia** - LocalStorage en desarrollo, Base de datos en producción

## 🚀 Inicio Rápido

### Frontend (corriendo en http://localhost:8000)

```bash
# El servidor está corriendo en:
http://localhost:8000

# Credenciales de prueba:
# Usuario: cualquier nombre (ej: "Juan")
# Sede: Sede Central, Sede Norte, Sede Sur
# Rol: Encargado de Sede, Encargado de Bodega, Administrador
```

### Backend (implementación recomendada)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Ejecutar servidor
npm start

# Backend disponible en: http://localhost:3000/api
```

## 📁 Estructura del Proyecto

```
GESTOR DE PEDIDOS/
├── 📄 index.html                # Interfaz de usuario
├── 📜 app.js                    # Lógica principal del frontend
├── 🔧 api-config.js             # Configuración de API y cliente HTTP
├── 💾 services.js               # Servicios de datos y lógica de negocio
├── 🎨 styles.css                # Estilos CSS responsivos
├── 📚 API_SPECIFICATION.js       # Especificación completa de endpoints
├── 📖 README_BACKEND.md          # Guía completa de implementación
├── 📦 package.json               # Dependencias recomendadas
├── ⚙️ server-example.js          # Servidor Express de ejemplo
├── 🔑 .env.example               # Variables de entorno
├── 🚫 .gitignore                 # Archivos a ignorar en git
└── 📋 README.md                  # Este archivo
```

## 🎯 Flujo de Trabajo

### 1️⃣ Login
- Ingresar usuario
- Seleccionar sede
- Elegir rol

### 2️⃣ Dashboard
- Visualizar estadísticas
- Ver pedidos recientes
- Notificaciones

### 3️⃣ Crear Pedido (Encargado de Sede)
- Buscar productos
- Agregar cantidad
- Especificar urgencia
- Enviar a bodega

### 4️⃣ Gestión (Encargado de Bodega)
- Revisar productos
- Ajustar cantidades
- Aprobar, rechazar o poner en revisión

### 5️⃣ Despacho y Seguimiento
- Despachar desde bodega
- Confirmar recepción en sede
- Ver historial completo

## 🔌 Conexión con Backend

### 1. Configurar URL de API

Editar `api-config.js`:
```javascript
const API_CONFIG = {
  BASE_URL: 'http://tu-backend.com/api',
  TIMEOUT: 5000,
};
```

### 2. Descomentar llamadas API

En `services.js`, cambiar datos mockeados por llamadas reales:
```javascript
// De:
return Promise.resolve(sampleOrders);

// A:
return ApiClient.get('ORDERS');
```

### 3. Implementar Backend

Ver `API_SPECIFICATION.js` para lista completa de endpoints requeridos.

**Endpoints principales:**
- `POST /auth/login` - Autenticación
- `GET /orders` - Listar pedidos
- `POST /orders` - Crear pedido
- `PATCH /orders/:id/status` - Actualizar estado
- `POST /orders/:id/approve` - Aprobar
- `POST /orders/:id/reject` - Rechazar
- `POST /orders/:id/dispatch` - Despachar
- `POST /orders/:id/receive` - Confirmar recepción

## 🛠️ Tecnologías

### Frontend (Actual)
- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo
- **JavaScript Vanilla** - Lógica sin dependencias

### Backend (Recomendado)
- **Node.js + Express** - Servidor API
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación token-based
- **Sequelize** - ORM

### Alternativas Backend
- **Python**: Django, FastAPI, Flask
- **Java**: Spring Boot
- **C#**: .NET Core
- **Go**: Echo, Gin
- **Ruby**: Rails

## 📊 Estructura de Datos

### Pedido (Order)
```json
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
      "quantity": 12,
      "quantityApproved": 12,
      "obs": ""
    }
  ],
  "history": [
    { "date": "2026-05-21", "event": "Pedido creado por Juan Pérez" }
  ]
}
```

### Producto (Product)
```json
{
  "ref": "EPP-001",
  "name": "Casco industrial",
  "unit": "und",
  "stock": 24
}
```

## 🔐 Autenticación

### Flujo de Login
1. Usuario envía: `username`, `branch`, `role`
2. Backend valida y retorna: `token` JWT
3. Frontend guarda: `token` en `localStorage`
4. Cada solicitud incluye: `Authorization: Bearer <token>`

### Token JWT (Backend)
```javascript
jwt.sign(
  { id, name, branch, role },
  JWT_SECRET,
  { expiresIn: '24h' }
)
```

## ✅ Validaciones

### Frontend
- Campo requerido validado antes de enviar
- Búsqueda de productos: mínimo 2 caracteres
- Pedido: al menos 1 producto requerido
- Cancelación: motivo obligatorio

### Backend (Recomendado)
- Validar estructura de datos
- Verificar stock disponible
- Validar permisos por rol y sede
- Validar transiciones de estado
- Prevenir duplicados

## 📱 Responsividad

- **Desktop** (1120px+): Sidebar fijo, layout 2 columnas
- **Tablet** (768px - 1120px): Sidebar horizontal, layout adaptable
- **Móvil** (<768px): Stack vertical, navegación responsive

## 🔄 Estados de Pedido

```
Pendiente
    ↓
En revisión
    ├→ Rechazado
    └→ Aprobado
        ↓
    Despachado
        ↓
    Recibido
```

## 📝 Notas Importantes

### Desarrollo Local
- **Frontend** funciona sin backend usando datos locales (localStorage)
- Permite pruebas UI/UX completas sin server
- Cambiar `API_CONFIG.BASE_URL` cuando backend esté listo

### Persistencia
- **localStorage** se limpia al borrar caché del navegador
- **Backend** debe usar BD persistente (PostgreSQL, MongoDB, etc.)

### Seguridad (Backend)
- Validar token en cada solicitud
- Filtrar datos por rol y sede del usuario
- Hash de contraseñas con bcrypt
- HTTPS en producción
- CORS configurado correctamente

## 🚀 Despliegue

### Desarrollo
```bash
python -m http.server 8000  # Frontend
npm run dev                  # Backend
```

### Producción
```bash
# Frontend: Nginx, Apache, Vercel, Netlify
# Backend: Heroku, AWS, DigitalOcean, Railway
# Database: AWS RDS, DigitalOcean Managed, Supabase
```

## 📈 Roadmap

- [ ] Notificaciones en tiempo real (WebSocket)
- [ ] Reportes y analytics
- [ ] Exportar PDF/Excel
- [ ] Integración SMS/Email
- [ ] Búsqueda avanzada
- [ ] Filtros guardados
- [ ] Calendario de entregas
- [ ] Auditoría completa
- [ ] App móvil (React Native)

## 🔗 Archivos de Referencia

- **API_SPECIFICATION.js** - Especificación completa de endpoints
- **README_BACKEND.md** - Guía paso a paso de implementación
- **server-example.js** - Servidor Express de ejemplo completo
- **.env.example** - Variables de entorno necesarias

## 📞 Soporte

Para problemas de integración:
1. Revisar `README_BACKEND.md`
2. Consultar `API_SPECIFICATION.js`
3. Usar `server-example.js` como referencia

## 📄 Licencia

MIT - Libre para usar y modificar

---

**Versión:** 1.0.0  
**Estado:** ✅ Listo para integración con backend  
**Última actualización:** 2026-05-29  
**Autor:** Equipo TEC MS
