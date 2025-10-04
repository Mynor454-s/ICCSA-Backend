# Sistema de Notificaciones por Email - Gestión de Pedidos

## Descripción
Sistema automático de notificaciones por email que informa a los clientes sobre cambios en el estado de sus cotizaciones.

## Características

### ✅ **Funcionalidades Implementadas:**
- 📧 **Envío automático** al cambiar estado de cotización
- 🎨 **Templates personalizados** para cada estado
- 🛡️ **Manejo de errores** sin afectar la operación principal
- ⚙️ **Configuración opcional** - funciona sin configurar
- 📱 **Responsive** - emails optimizados para móvil y desktop
- 🎯 **Sin impacto en frontend** - completamente transparente

### 🎨 **Estados con Notificación:**
- **CREADA** 📋 - Cotización recibida y en revisión
- **ACEPTADA** ✅ - Cotización aceptada, iniciando trabajo
- **EN_PROCESO** 🔄 - Trabajo en progreso
- **FINALIZADA** 🎯 - Trabajo completado, listo para pago
- **PAGADA** 💰 - Pago confirmado, listo para entrega
- **ENTREGADA** 📦 - Pedido entregado exitosamente

## Configuración

### 1. **Variables de Entorno (.env)**
```env
# Configuración de Email
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-de-gmail
COMPANY_NAME=ICCSA
```

### 2. **Configurar Gmail App Password**

#### Pasos para obtener App Password:
1. Ve a tu cuenta de Google
2. Activa la verificación en 2 pasos
3. Ve a "Contraseñas de aplicaciones"
4. Genera una nueva contraseña para "Otra aplicación"
5. Usa esa contraseña en `EMAIL_PASS`

### 3. **Verificación de Configuración**
Al iniciar el servidor verás:
```
✅ Email configurado correctamente - Notificaciones automáticas habilitadas
```
O:
```
⚠️  Email no configurado - Notificaciones automáticas deshabilitadas
```

## Funcionamiento

### **Automático y Transparente:**
1. **Cliente actualiza estado** → `PUT /api/quotes/:id/status`
2. **Sistema guarda cambio** en base de datos
3. **Sistema regenera QR** (si es necesario)
4. **🔥 Sistema envía email automáticamente** al cliente
5. **Respuesta normal** al frontend (sin cambios)

### **Manejo de Errores:**
- ❌ **No configurado**: Log informativo, operación continúa
- ❌ **Email inválido**: Log de advertencia, operación continúa
- ❌ **Error de red**: Log de error, operación continúa
- ✅ **Todo OK**: Log de éxito con detalles

## Templates de Email

### **Información Incluida:**
- 👤 **Personalización**: Nombre del cliente
- 📋 **Detalles**: Número de cotización, estado, total
- 📅 **Fechas**: Entrega estimada, actualización
- 🎨 **Visual**: Colores según estado, diseño profesional
- 💡 **Información útil**: Próximos pasos según estado

### **Ejemplos de Mensajes:**

**Estado FINALIZADA:**
> "Su trabajo está listo. Nos pondremos en contacto para coordinar el pago y la entrega."

**Estado PAGADA:**
> "Su pago ha sido confirmado. Nos comunicaremos pronto para coordinar la entrega de su pedido."

**Estado ENTREGADA:**
> "Su pedido ha sido entregado exitosamente. ¡Gracias por confiar en nosotros!"

## Logs del Sistema

### **Logs Informativos:**
```
📬 Enviando notificación de cambio de estado: FINALIZADA → PAGADA
✅ Email enviado exitosamente a cliente@email.com
📧 Message ID: <unique-message-id>
```

### **Logs de Advertencia:**
```
⚠️  Cliente Juan Pérez no tiene email registrado.
⚠️  Email no enviado: missing_config
```

### **Logs de Error:**
```
❌ Error enviando email de notificación: Connection timeout
```

## Estructura del Email

### **HTML Responsivo:**
- 📱 **Mobile-first**: Optimizado para móviles
- 🎨 **Branded**: Colores de la empresa
- 📊 **Informativo**: Información clara y organizada
- 🔗 **Professional**: Firma corporativa

### **Secciones:**
1. **Header**: Título del estado con color distintivo
2. **Saludo**: Personalizado con nombre del cliente
3. **Mensaje**: Explicación del nuevo estado
4. **Detalles**: Información de la cotización
5. **Próximos pasos**: Información útil según estado
6. **Footer**: Información corporativa

## Integración sin Impacto

### **Principios de Diseño:**
- 🔒 **No blocking**: Emails nunca bloquean operaciones
- 🛡️ **Error resilient**: Errores de email no afectan el sistema
- 📱 **Frontend transparent**: Cero cambios en el frontend
- ⚡ **Performance**: Envío asíncrono sin demoras

### **Comportamiento:**
```javascript
// El frontend sigue funcionando igual:
PUT /api/quotes/123/status
{
  "status": "PAGADA"
}

// Respuesta igual que antes:
{
  "message": "Estado actualizado correctamente",
  "status": "PAGADA",
  "qrCodeUrl": "/uploads/qr/quote_123.png"
}

// Pero ahora el cliente recibe email automáticamente 📧
```

## Casos de Uso

### **1. Notificación de Finalización:**
- Estado cambia a **FINALIZADA**
- Cliente recibe email: "Su trabajo está listo"
- Información sobre próximos pasos de pago

### **2. Confirmación de Pago:**
- Estado cambia a **PAGADA**
- Cliente recibe email: "Pago confirmado"
- Información sobre próxima entrega

### **3. Confirmación de Entrega:**
- Estado cambia a **ENTREGADA**
- Cliente recibe email: "Pedido entregado"
- Agradecimiento y cierre del proceso

## Ventajas del Sistema

### **Para el Negocio:**
- 🤖 **Automatización completa**
- 📞 **Reduce llamadas de consulta**
- 💼 **Imagen profesional**
- 📈 **Mejor experiencia del cliente**

### **Para el Cliente:**
- 📧 **Información inmediata**
- 📱 **Notificaciones en su email**
- 🔍 **Transparencia del proceso**
- 💌 **Comunicación proactiva**

### **Para el Desarrollo:**
- 🔧 **Cero cambios en frontend**
- 🛡️ **Sistema robusto**
- 📊 **Logs detallados**
- ⚙️ **Configuración opcional**

## Mantenimiento

### **Sin Email Configurado:**
- Sistema funciona normalmente
- Logs informativos sobre email no configurado
- No afecta ninguna funcionalidad

### **Con Email Configurado:**
- Emails automáticos activados
- Logs de éxito/error para debugging
- Experiencia mejorada para clientes

## Próximas Mejoras (Opcionales)

- 📎 **Adjuntar QR** al email
- 📊 **Dashboard de emails** enviados
- ⏰ **Programar envíos** específicos
- 🎨 **Templates personalizables** por empresa
- 📱 **SMS integration** como alternativa