# Generación de Códigos QR para Cotizaciones

## Descripción
Se ha implementado un sistema automático de generación de códigos QR únicos para cada cotización. Cada código QR contiene información detallada de la cotización en formato JSON.

## Funcionalidades Implementadas

### 1. Generación Automática
- Al crear una nueva cotización, se genera automáticamente un código QR
- El código QR se almacena como imagen PNG en el directorio `uploads/qr/`
- La URL del código QR se guarda en el campo `qrCodeUrl` de la cotización

### 2. Regeneración Automática
- Cuando se actualiza el estado de una cotización, se regenera automáticamente el código QR
- Esto mantiene la información del QR siempre actualizada

### 3. Información del Código QR
Cada código QR contiene la siguiente información en formato JSON:
```json
{
  "cotizacion_id": 123,
  "cliente": "Nombre del Cliente",
  "total": "$1,500.00",
  "estado": "ACEPTADA",
  "fecha_entrega": "15/08/2025",
  "fecha_creacion": "10/08/2025",
  "url_detalle": "http://localhost:3000/cotizaciones/123"
}
```

## Endpoints API

### 1. Obtener Todas las Cotizaciones (Nuevo)
```
GET /api/quotes
```
**Descripción:** Obtiene un listado resumido de todas las cotizaciones con paginación y filtros opcionales.

**Parámetros de consulta (Query Parameters):**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cotizaciones por página (default: 10)
- `status` (opcional): Filtrar por estado (CREADA, ACEPTADA, EN_PROCESO, FINALIZADA, PAGADA, ENTREGADA)
- `clientId` (opcional): Filtrar por ID del cliente

**Ejemplos:**
```bash
# Obtener todas las cotizaciones (página 1, 10 por página)
curl http://localhost:3000/api/quotes

# Paginación personalizada
curl "http://localhost:3000/api/quotes?page=2&limit=5"

# Filtrar por estado
curl "http://localhost:3000/api/quotes?status=ACEPTADA"

# Filtrar por cliente
curl "http://localhost:3000/api/quotes?clientId=1"

# Combinar filtros
curl "http://localhost:3000/api/quotes?status=CREADA&page=1&limit=20"
```

**Respuesta:**
```json
{
  "quotes": [
    {
      "id": 2,
      "status": "CREADA",
      "total": "1550.00",
      "deliveryDate": "2025-08-10T00:00:00.000Z",
      "qrCodeUrl": "/uploads/qr/quote_2_1755308694737.png",
      "createdAt": "2025-08-16T01:44:53.564Z",
      "updatedAt": "2025-08-16T01:44:54.933Z",
      "Client": {
        "name": "Carlos López",
        "email": "carlos@example.com"
      },
      "User": {
        "name": "Administrador"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalQuotes": 1,
    "quotesPerPage": 10
  }
}
```

### 2. Crear Cotización (Existente - Mejorado)
```
POST /api/quotes
```
**Respuesta actualizada:**
```json
{
  "message": "Cotización creada correctamente",
  "quoteId": 123,
  "qrCodeUrl": "/uploads/qr/quote_123_1692145678901.png"
}
```

### 3. Obtener Cotización Específica (Existente)
```
GET /api/quotes/:id
```
**Descripción:** Obtiene una cotización específica con todos los detalles (items, materiales, servicios).

### 4. Actualizar Estado (Existente - Mejorado)
```
PUT /api/quotes/:id/status
```
**Respuesta actualizada:**
```json
{
  "message": "Estado actualizado correctamente",
  "status": "ACEPTADA",
  "qrCodeUrl": "/uploads/qr/quote_123_1692145789012.png"
}
```

### 5. Regenerar Código QR (Nuevo)
```
POST /api/quotes/:id/regenerate-qr
```
**Respuesta:**
```json
{
  "message": "Código QR regenerado correctamente",
  "qrCodeUrl": "/uploads/qr/quote_123_1692145890123.png"
}
```

### 6. Obtener Información del QR (Nuevo)
```
GET /api/quotes/:id/qr-info
```
**Respuesta:**
```json
{
  "cotizacion_id": 123,
  "cliente": "Juan Pérez",
  "total": "$1,500.00",
  "estado": "ACEPTADA",
  "fecha_entrega": "15/08/2025",
  "fecha_creacion": "10/08/2025",
  "qr_url": "/uploads/qr/quote_123_1692145678901.png"
}
```

## Acceso a los Códigos QR

### Desde el Frontend
Los códigos QR son accesibles como archivos estáticos:
```
http://localhost:3001/uploads/qr/quote_123_1692145678901.png
```

### Desde el Frontend React/Vue/Angular
```javascript
// Mostrar el código QR en una imagen
const qrImageUrl = `${API_BASE_URL}${quote.qrCodeUrl}`;

// En React
<img src={qrImageUrl} alt="Código QR de la cotización" />

// En HTML
<img src="http://localhost:3001/uploads/qr/quote_123_1692145678901.png" alt="QR Code" />
```

## Scripts de Utilidad

### Generar QRs para Cotizaciones Existentes
Si tienes cotizaciones existentes sin códigos QR, puedes ejecutar:
```bash
npm run generate-qrs
```

Este script:
- Busca todas las cotizaciones que no tienen código QR
- Genera códigos QR para cada una
- Actualiza la base de datos con las URLs de los QR

## Estructura de Archivos Creados

```
Backend/
├── src/
│   ├── utils/
│   │   └── qrGenerator.js          # Utilidades para generar QR
│   └── controllers/
│       └── quote.controller.js     # Controlador actualizado
├── scripts/
│   └── generateMissingQRs.js       # Script para QRs faltantes
└── uploads/
    └── qr/                         # Directorio de códigos QR
        ├── quote_1_1692145678901.png
        ├── quote_2_1692145689012.png
        └── ...
```

## Configuración Adicional

### Variables de Entorno
Puedes agregar al archivo `.env`:
```env
FRONTEND_URL=http://localhost:3000
```
Esto se usa para generar la URL completa en el código QR.

### Personalización del QR
Puedes modificar el archivo `src/utils/qrGenerator.js` para:
- Cambiar el diseño del QR (colores, tamaño)
- Agregar más información al QR
- Cambiar el formato de la información

## Uso en el Frontend

### Ejemplo con JavaScript Vanilla
```javascript
// Obtener información del QR
fetch('/api/quotes/123/qr-info')
  .then(response => response.json())
  .then(data => {
    console.log('Información del QR:', data);
    
    // Mostrar el código QR
    const img = document.createElement('img');
    img.src = `${API_BASE_URL}${data.qr_url}`;
    img.alt = 'Código QR de la cotización';
    document.body.appendChild(img);
  });

// Obtener listado de cotizaciones
fetch('/api/quotes?page=1&limit=10')
  .then(response => response.json())
  .then(data => {
    console.log('Cotizaciones:', data.quotes);
    console.log('Paginación:', data.pagination);
  });
```

### Ejemplo con React - Listado de Cotizaciones
```jsx
import { useState, useEffect } from 'react';

function QuotesList() {
  const [quotes, setQuotes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: ''
  });

  useEffect(() => {
    fetchQuotes();
  }, [filters]);

  const fetchQuotes = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(filters).toString();
    
    try {
      const response = await fetch(`/api/quotes?${queryParams}`);
      const data = await response.json();
      setQuotes(data.quotes);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  if (loading) return <div>Cargando cotizaciones...</div>;

  return (
    <div>
      <h2>Cotizaciones</h2>
      
      {/* Filtros */}
      <div className="filters">
        <select 
          value={filters.status} 
          onChange={(e) => handleStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="CREADA">Creada</option>
          <option value="ACEPTADA">Aceptada</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="FINALIZADA">Finalizada</option>
          <option value="PAGADA">Pagada</option>
          <option value="ENTREGADA">Entregada</option>
        </select>
      </div>

      {/* Lista de cotizaciones */}
      <div className="quotes-list">
        {quotes.map(quote => (
          <div key={quote.id} className="quote-card">
            <h3>Cotización #{quote.id}</h3>
            <p><strong>Cliente:</strong> {quote.Client.name}</p>
            <p><strong>Estado:</strong> {quote.status}</p>
            <p><strong>Total:</strong> ${quote.total}</p>
            <p><strong>Fecha de entrega:</strong> {new Date(quote.deliveryDate).toLocaleDateString()}</p>
            
            {/* Mostrar QR si existe */}
            {quote.qrCodeUrl && (
              <img 
                src={`${process.env.REACT_APP_API_URL}${quote.qrCodeUrl}`}
                alt="QR Code"
                style={{ width: '50px', height: '50px' }}
              />
            )}
            
            <div className="actions">
              <button onClick={() => window.open(`/quotes/${quote.id}`, '_blank')}>
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button 
          disabled={pagination.currentPage === 1}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
        >
          Anterior
        </button>
        
        <span>
          Página {pagination.currentPage} de {pagination.totalPages} 
          ({pagination.totalQuotes} cotizaciones total)
        </span>
        
        <button 
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default QuotesList;
```

### Ejemplo con React - Código QR Individual
```jsx
import { useState, useEffect } from 'react';

function QuoteQRCode({ quoteId }) {
  const [qrInfo, setQrInfo] = useState(null);

  useEffect(() => {
    fetch(`/api/quotes/${quoteId}/qr-info`)
      .then(response => response.json())
      .then(setQrInfo);
  }, [quoteId]);

  if (!qrInfo) return <div>Cargando QR...</div>;

  return (
    <div>
      <h3>Código QR - Cotización #{qrInfo.cotizacion_id}</h3>
      <img 
        src={`${process.env.REACT_APP_API_URL}${qrInfo.qr_url}`}
        alt="Código QR"
        style={{ width: '200px', height: '200px' }}
      />
      <div>
        <p><strong>Cliente:</strong> {qrInfo.cliente}</p>
        <p><strong>Total:</strong> {qrInfo.total}</p>
        <p><strong>Estado:</strong> {qrInfo.estado}</p>
      </div>
    </div>
  );
}
```

## Solución de Problemas

### QR no se genera
- Verificar que el directorio `uploads/qr` tenga permisos de escritura
- Revisar los logs del servidor para errores
- Verificar que la librería `qrcode` esté instalada

### QR no se muestra en el frontend
- Verificar que la ruta estática esté configurada: `app.use('/uploads', express.static(...))`
- Verificar que el archivo exista en el directorio `uploads/qr`
- Revisar la URL completa del QR en el navegador

### Regenerar QRs faltantes
```bash
# Ejecutar el script para generar QRs faltantes
npm run generate-qrs
```
