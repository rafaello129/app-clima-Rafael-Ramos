## 2. Arquitectura de Módulos del Sistema

### 2.1 Diagrama de Módulos Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                     │
│                         (React Frontend)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Módulo de  │  │   Módulo de  │  │   Módulo de  │           │
│  │    Usuarios  │  │  Empresas    │  │  Catálogos   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Módulo de  │  │   Módulo de  │  │   Módulo de  │           │
│  │ Cotizaciones │  │  Facturación │  │   Reportes   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN (API)                     │
│                        (NestJS Backend)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │          Módulo de Autenticación y Autorización        │     │
│  │  • JWT Authentication                                  │     │
│  │  • Role-Based Access Control (RBAC)                    │     │
│  │  • Multi-tenant Context                                │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Módulo de  │  │   Módulo de  │  │   Módulo de  │           │
│  │   Usuarios   │  │   Empresas   │  │   Productos  │           │
│  │              │  │              │  │  y Servicios │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Módulo de  │  │   Módulo de  │  │   Módulo de  │           │
│  │ Cotizaciones │  │   Clientes   │  │  Facturación │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │            Módulo de Integración con FINKOK            │     │
│  │  • Generación de XML (CFDI 4.0)                        │     │
│  │  • Timbrado fiscal                                     │     │
│  │  • Cancelación de facturas                             │     │
│  │  • Validación de certificados                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              Módulo de Documentos y Plantillas         │     │
│  │  • Generación de PDFs                                  │     │
│  │  • Personalización (logos, colores)                    │     │
│  │  • Envío por email                                     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                Módulo de Auditoría                     │     │
│  │  • Logging de operaciones                              │     │
│  │  • Historial de cambios                                │     │
│  │  • Trazabilidad de documentos                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CAPA DE DATOS                             │
│                    (SQL Database)                               │
├─────────────────────────────────────────────────────────────────┤
│  • Modelo Multi-tenant                                          │
│  • Aislamiento de datos por empresa                             │
│  • Transacciones ACID                                           │
│  • Backup automático                                            │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │    FINKOK    │  │  Servicio de │  │  Servicio de │           │
│  │     PAC      │  │    Email     │  │    Storage   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Descripción Detallada de Módulos

### 3.1 Módulo de Autenticación y Autorización
**Responsabilidad**: Gestionar el acceso al sistema según roles y permisos.

**Componentes**:
- Sistema de autenticación JWT
- Control de acceso basado en roles (Dueño, Administrador, Trabajador)
- Middleware de multi-tenancy (contexto de empresa activa)
- Gestión de sesiones y tokens de refresco

**Interacciones**:
- Todos los módulos del sistema pasan por este módulo para validar permisos
- Se conecta con el Módulo de Usuarios para validar credenciales

---

### 3.2 Módulo de Usuarios
**Responsabilidad**: Administrar usuarios del sistema y sus relaciones con empresas.

**Componentes**:
- Gestión de perfiles de usuario
- Asignación de roles por empresa
- Gestión de contraseñas y seguridad
- Invitaciones a nuevos usuarios

**Entidades principales**:
- Usuario (datos personales, credenciales)
- UsuarioEmpresa (relación usuario-empresa con rol específico)

---

### 3.3 Módulo de Empresas
**Responsabilidad**: Gestionar la información fiscal y operativa de cada organización.

**Componentes**:
- Registro y actualización de datos fiscales
- Gestión de certificados SAT (.cer, .key)
- Configuración de personalización (logos, colores, plantillas)
- Administración de datos de contacto

**Entidades principales**:
- Empresa (RFC, razón social, domicilio fiscal)
- ConfiguracionEmpresa (personalización visual)
- CertificadosSAT (certificados digitales vigentes)

---

### 3.4 Módulo de Productos y Servicios (Catálogo)
**Responsabilidad**: Administrar el catálogo de productos/servicios por empresa.

**Componentes**:
- CRUD de productos y servicios
- Categorización y búsqueda
- Gestión de precios y descripción
- Vinculación con claves SAT (ClaveProdServ)

**Entidades principales**:
- Producto/Servicio (descripción, precio, unidad, clave SAT)
- CategoriaProducto (organización del catálogo)

---

### 3.5 Módulo de Clientes
**Responsabilidad**: Gestionar la información de clientes por empresa.

**Componentes**:
- Registro de clientes (personas físicas y morales)
- Datos fiscales para facturación
- Historial de transacciones por cliente
- Búsqueda y filtrado

**Entidades principales**:
- Cliente (RFC, razón social, régimen fiscal, uso CFDI)
- DireccionCliente (domicilio fiscal)

---

### 3.6 Módulo de Cotizaciones
**Responsabilidad**: Crear, gestionar y aprobar cotizaciones.

**Componentes**:
- Creación de cotizaciones (selección de productos/servicios)
- Cálculo automático de subtotales, impuestos y totales
- Workflow de aprobación (Trabajador → Administrador)
- Generación de PDF para envío
- Conversión de cotización a factura

**Entidades principales**:
- Cotizacion (folio, fecha, cliente, estado, totales)
- DetalleCotizacion (productos/servicios incluidos)
- HistorialEstadoCotizacion (auditoría de cambios)

**Estados de cotización**:
- Borrador
- Enviada al cliente
- Aprobada
- Rechazada
- Convertida a factura

---

### 3.7 Módulo de Facturación
**Responsabilidad**: Generar facturas electrónicas y gestionar su ciclo de vida.

**Componentes**:
- Generación de estructura XML CFDI 4.0
- Validación de datos fiscales
- Gestión de serie y folio
- Almacenamiento de facturas emitidas
- Consulta y búsqueda de facturas
- Cancelación de facturas

**Entidades principales**:
- Factura (folio fiscal, UUID, fecha, cliente, totales)
- DetalleFactura (conceptos facturados)
- ImpuestosFactura (IVA, retenciones)
- EstadoFactura (vigente, cancelada)

---

### 3.8 Módulo de Integración con FINKOK
**Responsabilidad**: Comunicación con el PAC para timbrado y cancelación.

**Componentes**:
- Cliente API FINKOK
- Generación de XML según especificaciones SAT
- Envío para timbrado
- Recepción de UUID y timbre fiscal
- Cancelación de facturas ante SAT
- Manejo de errores y reintentos
- Validación de certificados

**Flujo de integración**:
1. Módulo de Facturación genera estructura de factura
2. Integración FINKOK construye XML CFDI 4.0
3. Firma digitalmente con certificados de la empresa
4. Envía a FINKOK para timbrado
5. Recibe UUID y timbre fiscal
6. Actualiza factura en base de datos
7. Notifica al usuario

---

### 3.9 Módulo de Documentos y Plantillas
**Responsabilidad**: Generar representaciones visuales de documentos.

**Componentes**:
- Motor de plantillas personalizables
- Generación de PDF (cotizaciones y facturas)
- Aplicación de branding (logos, colores)
- Conversión de XML a representación visual
- Integración con servicio de email

**Funcionalidades**:
- Plantillas predeterminadas
- Editor de plantillas para administradores
- Vista previa de documentos
- Descarga y envío por correo

---

### 3.10 Módulo de Auditoría
**Responsabilidad**: Registro de operaciones críticas y trazabilidad.

**Componentes**:
- Logger de operaciones por usuario
- Historial de cambios en documentos
- Trazabilidad de estados (cotizaciones, facturas)
- Registro de intentos de acceso
- Alertas de seguridad

**Entidades principales**:
- LogAuditoria (acción, usuario, fecha, datos modificados)
- HistorialDocumento (versiones de cotizaciones/facturas)

---

## 4. Flujo de Datos Principal

### 4.1 Flujo de Autenticación

```
┌─────────┐         ┌──────────┐         ┌─────────────┐
│ Usuario │────────>│ Frontend │────────>│   Backend   │
└─────────┘  Login  └──────────┘  POST   │ Auth Module │
                                          └─────────────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │  Validar    │
                                          │ credenciales│
                                          └─────────────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │  Obtener    │
                                          │  empresas   │
                                          │  y roles    │
                                          └─────────────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │  Generar    │
                                          │  JWT token  │
                                          └─────────────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │  Respuesta  │
                    ┌────────────────────│ con token y │
                    │                     │   datos     │
                    ▼                     └─────────────┘
             ┌──────────┐
             │ Frontend │
             │  guarda  │
             │  token   │
             └──────────┘
```

---

### 4.2 Flujo de Creación de Cotización

```
┌────────────┐         ┌──────────┐         ┌─────────────────┐
│ Trabajador │────────>│ Frontend │────────>│ Backend         │
└────────────┘ Solicita└──────────┘  POST   │ Cotizaciones    │
               cotización                    │ Module          │
                                             └─────────────────┘
                                                      │
                  ┌───────────────────────────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  Validar     │
           │  permisos y  │
           │  contexto    │
           │  empresa     │
           └──────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  Validar     │
           │  productos/  │
           │  servicios   │
           │  existen     │
           └──────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  Calcular    │
           │  subtotales, │
           │  impuestos,  │
           │  totales     │
           └──────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  Guardar     │
           │  cotización  │
           │  en BD       │
           │ (estado:     │
           │  Borrador)   │
           └──────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  Registrar   │
           │  en auditoría│
           └──────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  Notificar   │
           │  a Admin     │
           └──────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  Respuesta   │
           │  con datos   │
           │  cotización  │
           └──────────────┘
```

---

### 4.3 Flujo de Emisión de Factura con Timbrado

```
┌──────────────┐         ┌──────────┐         ┌─────────────────┐
│Administrador │────────>│ Frontend │────────>│ Backend         │
└──────────────┘ Emitir  └──────────┘  POST   │ Facturación     │
                 factura                       │ Module          │
                                               └─────────────────┘
                                                        │
                    ┌───────────────────────────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Validar     │
             │  permisos    │
             │  (Admin/     │
             │  Dueño)      │
             └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Validar     │
             │  datos       │
             │  fiscales    │
             │  completos   │
             └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Calcular    │
             │  impuestos   │
             │  y totales   │
             └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Guardar     │
             │  factura     │
             │  (Pre-       │
             │  timbrado)   │
             └──────────────┘
                    │
                    ▼
             ┌──────────────────────┐
             │ Integración FINKOK   │
             │ Module               │
             └──────────────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Generar     │
             │  XML CFDI    │
             │  4.0         │
             └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Firmar      │
             │  con         │
             │  certificados│
             │  empresa     │
             └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Enviar a    │
             │  FINKOK PAC  │◄────────┐
             └──────────────┘         │
                    │                 │
                    ▼                 │
             ┌──────────────┐         │
             │  ¿Éxito?     │         │
             └──────────────┘         │
                    │                 │
        ┌───────────┴───────────┐     │
        │                       │     │
        ▼ SÍ                    ▼ NO  │
 ┌──────────────┐        ┌──────────────┐
 │  Recibir     │        │  Manejo de   │
 │  UUID y      │        │  error y     │
 │  timbre      │        │  reintento   │──┘
 │  fiscal      │        └──────────────┘
 └──────────────┘
        │
        ▼
 ┌──────────────┐
 │  Actualizar  │
 │  factura     │
 │  con UUID    │
 │  (Timbrada)  │
 └──────────────┘
        │
        ▼
 ┌──────────────┐
 │  Generar     │
 │  PDF con     │
 │  código QR   │
 └──────────────┘
        │
        ▼
 ┌──────────────┐
 │  Registrar   │
 │  en          │
 │  auditoría   │
 └──────────────┘
        │
        ▼
 ┌──────────────┐
 │  Enviar      │
 │  email a     │
 │  cliente     │
 └──────────────┘
        │
        ▼
 ┌──────────────┐
 │  Respuesta   │
 │  con factura │
 │  timbrada    │
 └──────────────┘
```

---

### 4.4 Flujo de Consulta de Historial

```
┌─────────┐         ┌──────────┐         ┌─────────────────┐
│ Usuario │────────>│ Frontend │────────>│ Backend         │
└─────────┘ Consulta└──────────┘  GET    │ Módulo          │
            historial              +      │ correspondiente │
                                 filtros  └─────────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Validar     │
                                            │  permisos    │
                                            └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Aplicar     │
                                            │  contexto    │
                                            │  multi-tenant│
                                            │  (empresa)   │
                                            └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Aplicar     │
                                            │  filtros     │
                                            │  (fechas,    │
                                            │  cliente,    │
                                            │  estado)     │
                                            └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Consultar   │
                                            │  base de     │
                                            │  datos       │
                                            └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Aplicar     │
                                            │  paginación  │
                                            └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Formatear   │
                                            │  respuesta   │
                                            └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Retornar    │
                                            │  resultados  │
                                            └──────────────┘
```

---

## 5. Estrategia Multi-Tenant

Para garantizar la independencia y seguridad de los datos de cada empresa, se implementará una estrategia **multi-tenant a nivel de datos con discriminador de tenant**.

### 5.1 Enfoque de Implementación

**Opción seleccionada**: **Base de datos compartida con columna discriminadora**

Cada tabla relevante incluirá una columna `empresa_id` que actuará como discriminador de tenant:

```sql
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,  -- Discriminador de tenant
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    clave_sat VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    INDEX idx_empresa_productos (empresa_id)
);
```

### 5.2 Ventajas de este enfoque

- **Eficiencia de recursos**: Una sola base de datos para todas las empresas
- **Mantenimiento simplificado**: Actualizaciones y migraciones únicas
- **Escalabilidad**: Fácil agregar nuevas empresas sin infraestructura adicional
- **Costo-efectivo**: Menor overhead de bases de datos

### 5.3 Implementación de Seguridad Multi-Tenant

**Middleware de contexto de empresa**:
```typescript
// Pseudocódigo ilustrativo
@Injectable()
export class TenantMiddleware {
  async use(req, res, next) {
    const user = req.user; // Del token JWT
    const empresaId = req.headers['x-empresa-id'];
    
    // Validar que el usuario tiene acceso a esa empresa
    if (!user.hasAccessToEmpresa(empresaId)) {
      throw new ForbiddenException();
    }
    
    // Establecer contexto de empresa para esta petición
    req.empresaContext = empresaId;
    next();
  }
}
```

**Interceptor de consultas**:
```typescript
// Pseudocódigo ilustrativo
@Injectable()
export class TenantInterceptor {
  intercept(context, next) {
    const request = context.switchToHttp().getRequest();
    const empresaId = request.empresaContext;
    
    // Todas las consultas automáticamente filtran por empresa_id
    // Esto se puede lograr con TypeORM scopes o query builders
    return next.handle();
  }
}
```

### 5.4 Reglas de Aislamiento

1. **Toda query debe incluir filtro por empresa_id** excepto:
   - Tablas de configuración global
   - Tabla de usuarios (puede pertenecer a múltiples empresas)
   - Catálogos SAT (compartidos)

2. **Validación en múltiples capas**:
   - Frontend: UI solo muestra datos de empresa seleccionada
   - API Gateway: Valida empresa en contexto de usuario
   - Servicio: Aplica filtro automático en queries
   - Base de datos: Constraints de foreign keys

3. **Auditoría obligatoria**:
   - Todo acceso a datos sensibles se registra con empresa_id
   - Logs incluyen usuario, empresa y operación realizada

---

## 6. Arquitectura de Base de Datos

### 6.1 Modelo Entidad-Relación Simplificado

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   USUARIOS   │────────<│ USUARIO_EMPRESA  │>────────│   EMPRESAS   │
└──────────────┘    n    └──────────────────┘    n    └──────────────┘
      │                           │                           │
      │                           │ rol                       │
      │                           │ (Dueño/Admin/             │
      │                           │  Trabajador)              │
      │                                                       │
      │                                                       │ 1
      │                                                       │
      │                                                       ▼ n
      │                                              ┌──────────────────┐
      │                                              │  CONFIGURACION   │
      │                                              │     EMPRESA      │
      │                                              └──────────────────┘
      │                                                       │ 1
      │                                                       │
      │                                                       ▼ n
      │                                              ┌──────────────────┐
      │                                              │   PRODUCTOS/     │
      │                                              │    SERVICIOS     │
      │                                              └──────────────────┘
      │                                                       │
      │                                                       │
      │                                              ┌────────┴────────┐
      │                                              │                 │
      │                                              ▼ n               ▼ n
      │                                     ┌──────────────┐  ┌──────────────┐
      │                                     │   DETALLE    │  │   DETALLE    │
      │                                     │  COTIZACION  │  │   FACTURA    │
      │                                     └──────────────┘  └──────────────┘
      │                                              ▲                 ▲
      │                                              │ n               │ n
      │                                              │                 │
      │                                              │ 1               │ 1
      │                                     ┌──────────────┐  ┌──────────────┐
      └────────────────────────────────────│ COTIZACIONES │  │   FACTURAS   │
                   (creado_por)             └──────────────┘  └──────────────┘
                                                     │ n               │ n
                                                     │                 │
                                                     │ 1               │ 1
                                                     │                 │
                                                     ▼                 ▼
                                              ┌──────────────────────────┐
                                              │       CLIENTES           │
                                              │    (por empresa)         │
                                              └──────────────────────────┘
```

### 6.2 Tablas Principales

**Tabla: usuarios**
- id (PK)
- email (único)
- password_hash
- nombre
- apellido
- fecha_registro
- activo

**Tabla: empresas**
- id (PK)
- rfc (único)
- razon_social
- regimen_fiscal
- domicilio_fiscal
- telefono
- email
- activo
- fecha_registro

**Tabla: usuario_empresa** (relación many-to-many con rol)
- id (PK)
- usuario_id (FK)
- empresa_id (FK)
- rol (enum: 'dueño', 'administrador', 'trabajador')
- fecha_asignacion
- activo

**Tabla: productos**
- id (PK)
- empresa_id (FK) -- **Discriminador multi-tenant**
- nombre
- descripcion
- precio
- unidad
- clave_sat
- activo

**Tabla: clientes**
- id (PK)
- empresa_id (FK) -- **Discriminador multi-tenant**
- rfc
- razon_social
- regimen_fiscal
- uso_cfdi
- email
- telefono
- activo

**Tabla: cotizaciones**
- id (PK)
- empresa_id (FK) -- **Discriminador multi-tenant**
- folio
- fecha
- cliente_id (FK)
- creado_por_usuario_id (FK)
- estado (enum: 'borrador', 'enviada', 'aprobada', 'rechazada', 'convertida')
- subtotal
- impuestos
- total
- observaciones
- fecha_creacion

**Tabla: detalle_cotizacion**
- id (PK)
- cotizacion_id (FK)
- producto_id (FK)
- cantidad
- precio_unitario
- subtotal

**Tabla: facturas**
- id (PK)
- empresa_id (FK) -- **Discriminador multi-tenant**
- serie
- folio
- uuid (UUID fiscal del SAT)
- fecha
- cliente_id (FK)
- cotizacion_id (FK, nullable)
- estado (enum: 'pre_timbrado', 'timbrada', 'cancelada')
- subtotal
- impuestos
- total
- xml_path (ruta al archivo XML)
- pdf_path (ruta al archivo PDF)
- fecha_timbrado
- fecha_creacion

**Tabla: detalle_factura**
- id (PK)
- factura_id (FK)
- producto_id (FK)
- cantidad
- precio_unitario
- subtotal
- impuestos

**Tabla: log_auditoria**
- id (PK)
- empresa_id (FK)
- usuario_id (FK)
- accion (enum: 'crear', 'editar', 'eliminar', 'timbrar', 'cancelar')
- entidad (string: 'cotizacion', 'factura', etc.)
- entidad_id
- datos_anteriores (JSON)
- datos_nuevos (JSON)
- ip_address
- timestamp

---

## 7. Puntos de Integración con SAT y FINKOK

### 7.1 Integración con FINKOK PAC

**Servicios de FINKOK a utilizar**:

1. **Timbrado de CFDI (stamp)**
   - **Endpoint**: `https://facturacion.finkok.com/servicios/soap/stamp.wsdl`
   - **Función**: Recibe XML CFDI pre-firmado y devuelve UUID + timbre fiscal
   - **Input**: XML CFDI firmado con certificado de la empresa
   - **Output**: XML timbrado con UUID y sello SAT

2. **Cancelación de CFDI (cancel)**
   - **Endpoint**: `https://facturacion.finkok.com/servicios/soap/cancel.wsdl`
   - **Función**: Cancela facturas ante el SAT
   - **Input**: UUID de factura, RFC emisor, motivo cancelación
   - **Output**: Confirmación de cancelación

3. **Consulta de estatus (query_pending)**
   - **Endpoint**: Servicio de consulta FINKOK
   - **Función**: Verificar estado de timbrado
   - **Output**: Estado actual del CFDI

### 7.2 Flujo de Integración con FINKOK

```
┌─────────────────────┐
│  Sistema Backend    │
│  (NestJS)           │
└──────────┬──────────┘
           │
           │ 1. Genera XML CFDI 4.0
           │    según anexo 20 SAT
           ▼
┌─────────────────────┐
│  Módulo de          │
│  Facturación        │
└──────────┬──────────┘
           │
           │ 2. Obtiene certificados
           │    (.cer, .key) de empresa
           ▼
┌─────────────────────┐
│  Módulo Integración │
│  FINKOK             │
└──────────┬──────────┘
           │
           │ 3. Firma XML con
           │    certificado privado
           ▼
┌─────────────────────┐
│  Cliente SOAP       │
│  FINKOK             │
└──────────┬──────────┘
           │
           │ 4. Envía XML firmado
           │    vía SOAP
           ▼
╔═══════════════════════╗
║   FINKOK PAC          ║
║   (Servicio externo)  ║
╚═══════════════════════╝
           │
           │ 5. Valida XML
           │ 6. Envía a SAT
           │ 7. Recibe timbre
           ▼
╔═══════════════════════╗
║   SAT                 ║
║   (Validación)        ║
╚═══════════════════════╝
           │
           │ 8. Retorna UUID
           │    y timbre fiscal
           ▼
┌─────────────────────┐
│  Sistema Backend    │
│  - Guarda UUID      │
│  - Actualiza estado │
│  - Genera PDF       │
└─────────────────────┘
```

### 7.3 Datos requeridos para FINKOK

**Configuración de cuenta FINKOK** (por empresa):
- Usuario FINKOK (RFC de la empresa)
- Contraseña de API
- Certificado SAT (.cer) - Archivo público
- Llave privada SAT (.key) - Archivo privado
- Contraseña de llave privada

**Datos por factura a timbrar**:
- XML CFDI 4.0 completo y válido
- Firmado digitalmente con el certificado de la empresa
- Cumpliendo con el estándar del SAT (Anexo 20)

### 7.4 Validaciones pre-timbrado

Antes de enviar a FINKOK, el sistema debe validar:

1. **Datos fiscales completos**:
   - RFC emisor y receptor válidos
   - Régimen fiscal correcto
   - Uso de CFDI válido
   - Forma de pago correcta

2. **Estructura del XML**:
   - Versión CFDI 4.0
   - Todos los nodos obligatorios presentes
   - Tipos de datos correctos
   - Catálogos SAT vigentes

3. **Cálculos correctos**:
   - Suma de conceptos = subtotal
   - Impuestos calculados correctamente
   - Total = subtotal + impuestos - retenciones

4. **Certificados vigentes**:
   - Certificado no vencido
   - Certificado válido ante el SAT
   - Llave privada corresponde al certificado

### 7.5 Manejo de Errores de FINKOK

**Errores comunes y estrategias**:

| Error | Causa | Acción del Sistema |
|-------|-------|-------------------|
| 307 - Certificado vencido | Certificado SAT expiró | Notificar admin, bloquear timbrado |
| 401 - Error de autenticación | Credenciales incorrectas | Verificar configuración FINKOK |
| 500 - Error en XML | XML mal formado | Validar generación de XML |
| 702 - RFC no existe | RFC receptor inválido | Validar RFC antes de timbrar |
| Timeout | Problemas de red | Sistema de reintentos (3 intentos) |

**Estrategia de reintentos**:
- Primer intento: Inmediato
- Segundo intento: Después de 30 segundos
- Tercer intento: Después de 2 minutos
- Si falla: Notificar administrador y marcar para revisión manual

---


## 10.Implementación

### 10.1 Fases de Desarrollo Sugeridas

**Fase 1: Fundamentos** (4-6 semanas)
- Autenticación y autorización
- Módulo de usuarios y empresas
- Configuración multi-tenant
- Dashboard básico

**Fase 2: Catálogos y Cotizaciones** (3-4 semanas)
- Módulo de productos/servicios
- Módulo de clientes
- Módulo de cotizaciones
- Generación de PDF cotizaciones

**Fase 3: Facturación** (5-6 semanas)
- Módulo de facturación
- Generación de XML CFDI 4.0
- Integración con FINKOK
- Timbrado y cancelación
- Generación de PDF facturas

**Fase 4: Auditoría y Reportes** (2-3 semanas)
- Módulo de auditoría
- Historial y búsquedas
- Reportes básicos
- Exportación de datos

**Fase 5: Refinamiento** (2-3 semanas)
- Personalización de plantillas
- Optimizaciones de rendimiento
- Testing exhaustivo
- Documentación

### 10.2 Dependencias Críticas

**Librerías de NestJS**:
- `@nestjs/jwt` - Autenticación
- `@nestjs/passport` - Estrategias de auth
- `@nestjs/typeorm` - ORM
- `@nestjs/config` - Configuración
- `class-validator` - Validaciones
- `class-transformer` - DTOs

**Generación de documentos**:
- `xmlbuilder2` - Construcción de XML CFDI
- `node-forge` - Firma digital de XML
- `pdfkit` o `puppeteer` - Generación de PDFs

**Integración FINKOK**:
- `soap` o `strong-soap` - Cliente SOAP para FINKOK
- Custom wrapper para simplificar llamadas

**Seguridad**:
- `bcrypt` - Hash de contraseñas
- `helmet` - Headers de seguridad
- `crypto` (nativo Node.js) - Encriptación

---
