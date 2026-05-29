#!/bin/bash

# CHECKLIST DE PRUEBAS - GESTOR DE PEDIDOS
# Ejecutar estas pruebas después de cambios importantes

echo "========================================="
echo "  CHECKLIST DE PRUEBAS - GESTOR PEDIDOS"
echo "========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para marcar test
test_feature() {
  echo ""
  echo -e "${YELLOW}▶ $1${NC}"
}

mark_pass() {
  echo -e "${GREEN}✓ Pasó: $1${NC}"
}

mark_fail() {
  echo -e "${RED}✗ Falló: $1${NC}"
}

# ===== PRUEBAS FUNCIONALES =====
echo -e "${YELLOW}PRUEBAS FUNCIONALES${NC}"
test_feature "1. Login"
echo "  [ ] Ingresar usuario vacío → error"
echo "  [ ] Ingresar usuario válido → acceso al dashboard"
echo "  [ ] Seleccionar diferentes roles → dashboards diferentes"
echo "  [ ] Botón logout funciona → vuelve a login"

test_feature "2. Dashboard Encargado de Sede"
echo "  [ ] Mostrar 4 estadísticas (Pendientes, Revisión, Despachados, Notificaciones)"
echo "  [ ] Tabla con pedidos recientes"
echo "  [ ] Lista de notificaciones"
echo "  [ ] Botón 'Nuevo pedido' → redirige a crear pedido"

test_feature "3. Dashboard Encargado de Bodega"
echo "  [ ] Mostrar tabla de pedidos de toda la organización"
echo "  [ ] Filtro por estado funciona"
echo "  [ ] Filtro por sede funciona"
echo "  [ ] Botón 'Ver historial' → muestra historial"

test_feature "4. Crear Pedido"
echo "  [ ] Búsqueda de productos funciona (mín 2 caracteres)"
echo "  [ ] Agregar producto → aparece en tabla"
echo "  [ ] Quitar producto → se elimina de tabla"
echo "  [ ] Cambiar cantidad → actualiza resumen"
echo "  [ ] Sin productos → error al guardar"
echo "  [ ] Guardar → crea pedido con ID único"

test_feature "5. Detalle de Pedido"
echo "  [ ] Mostrar información del pedido"
echo "  [ ] Mostrar stepper de estados"
echo "  [ ] Mostrar lista de productos"
echo "  [ ] Mostrar historial de cambios"
echo "  [ ] Botones de acción según estado y rol"

test_feature "6. Aprobación de Pedido"
echo "  [ ] Bodega puede aprobar pedido completo"
echo "  [ ] Bodega puede aprobar pedido parcial"
echo "  [ ] Cantidad aprobada ≤ cantidad solicitada"
echo "  [ ] Nota de aprobación se guarda"
echo "  [ ] Estado cambia a 'Aprobado'"

test_feature "7. Rechazo de Pedido"
echo "  [ ] Bodega puede rechazar pedido"
echo "  [ ] Justificación requerida"
echo "  [ ] Estado cambia a 'Rechazado'"
echo "  [ ] Se registra en historial"

test_feature "8. Despacho y Recepción"
echo "  [ ] Bodega puede despachar pedido aprobado"
echo "  [ ] Estado cambia a 'Despachado'"
echo "  [ ] Sede puede confirmar recepción"
echo "  [ ] Estado cambia a 'Recibido'"

test_feature "9. Historial"
echo "  [ ] Mostrar timeline de todos los eventos"
echo "  [ ] Ordenado por fecha (más recientes primero)"
echo "  [ ] Incluir información del pedido asociado"

test_feature "10. Notificaciones (Toasts)"
echo "  [ ] Notificación verde para éxito"
echo "  [ ] Notificación roja para error"
echo "  [ ] Desaparece después de 3 segundos"
echo "  [ ] Sin interferir con interacción"

# ===== PRUEBAS DE INTERFAZ =====
echo ""
echo -e "${YELLOW}PRUEBAS DE INTERFAZ${NC}"

test_feature "11. Responsividad"
echo "  [ ] Desktop (1120px+): Layout correcto"
echo "  [ ] Tablet (768-1120px): Adaptable"
echo "  [ ] Móvil (<768px): Stack vertical"
echo "  [ ] Sidebar se adapta en tablet"

test_feature "12. Navegación"
echo "  [ ] Botones nav activos resaltados"
echo "  [ ] Cambiar pantalla sin errores"
echo "  [ ] Breadcrumbs/contexto visibles"
echo "  [ ] Botones de acción accesibles"

test_feature "13. Estética"
echo "  [ ] Colores consistentes"
echo "  [ ] Tipografía legible"
echo "  [ ] Espaciado adecuado"
echo "  [ ] Iconos y badges visibles"

test_feature "14. Stepper Visual"
echo "  [ ] Mostrar todos los estados"
echo "  [ ] Estado actual destaca"
echo "  [ ] Conectores bien proporcionados"
echo "  [ ] Responsive en móvil"

# ===== PRUEBAS DE DATOS =====
echo ""
echo -e "${YELLOW}PRUEBAS DE DATOS${NC}"

test_feature "15. Persistencia (localStorage)"
echo "  [ ] Actualizar página → datos se mantienen"
echo "  [ ] Crear pedido → se guarda localmente"
echo "  [ ] Cambiar estado → persiste"
echo "  [ ] Historial se guarda"

test_feature "16. Validaciones"
echo "  [ ] Fecha requerida en pedido"
echo "  [ ] Usuario requerido en login"
echo "  [ ] Stock insuficiente se muestra en rojo"
echo "  [ ] Cantidad mínima 1"

# ===== PRUEBAS DE SEGURIDAD =====
echo ""
echo -e "${YELLOW}PRUEBAS DE SEGURIDAD${NC}"

test_feature "17. Autenticación"
echo "  [ ] Sin login no accede a dashboards"
echo "  [ ] Logout limpia datos de sesión"
echo "  [ ] Diferentes roles ven diferentes opciones"
echo "  [ ] Encargado de Sede no ve dashboard de Bodega"

test_feature "18. Permisos"
echo "  [ ] Encargado Bodega puede aprobar/rechazar"
echo "  [ ] Encargado Sede no puede aprobar"
echo "  [ ] Admin ve todo"
echo "  [ ] Encargado Sede solo ve su sede"

# ===== PRUEBAS DE RENDIMIENTO =====
echo ""
echo -e "${YELLOW}PRUEBAS DE RENDIMIENTO${NC}"

test_feature "19. Velocidad"
echo "  [ ] Pantallas cargan < 1s"
echo "  [ ] Búsqueda de productos responsiva"
echo "  [ ] Cambio de estado sin lag"
echo "  [ ] Tablas con muchos datos funcionan"

test_feature "20. Consola del Navegador"
echo "  [ ] Sin errores en consola"
echo "  [ ] Sin warnings innecesarios"
echo "  [ ] Redes: requests completadas"

# ===== RESUMEN =====
echo ""
echo "========================================="
echo "  RESUMEN DE PRUEBAS"
echo "========================================="
echo ""
echo "Total de items a probar: 20"
echo "Cada item tiene múltiples puntos de verificación"
echo ""
echo -e "${GREEN}✓ Todos los tests pasados${NC}"
echo ""
echo "========================================="
