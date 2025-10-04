import nodemailer from 'nodemailer';

// Crear transporter para el envío de emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // App Password de Gmail
    }
  });
};

// Template de email personalizado por estado
const getEmailTemplate = (client, quote) => {
  const statusMessages = {
    'CREADA': {
      title: '📋 Cotización Creada',
      message: 'Hemos recibido su solicitud de cotización y está siendo revisada por nuestro equipo.',
      color: '#6c757d'
    },
    'ACEPTADA': {
      title: '✅ Cotización Aceptada',
      message: 'Su cotización ha sido aceptada. Procederemos con la preparación de su pedido.',
      color: '#28a745'
    },
    'EN_PROCESO': {
      title: '🔄 En Proceso',
      message: 'Su pedido está actualmente en proceso de elaboración. Le mantendremos informado del progreso.',
      color: '#ffc107'
    },
    'FINALIZADA': {
      title: '🎯 Trabajo Finalizado',
      message: 'Su pedido ha sido completado exitosamente. Está listo para el proceso de pago y entrega.',
      color: '#17a2b8'
    },
    'PAGADA': {
      title: '💰 Pago Recibido',
      message: 'Hemos confirmado su pago. Su pedido está listo para ser entregado.',
      color: '#28a745'
    },
    'ENTREGADA': {
      title: '📦 Pedido Entregado',
      message: 'Su pedido ha sido entregado exitosamente. ¡Gracias por confiar en nosotros!',
      color: '#6f42c1'
    }
  };

  const statusInfo = statusMessages[quote.status] || statusMessages['CREADA'];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Estado de Cotización #${quote.id}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: linear-gradient(135deg, ${statusInfo.color}, ${statusInfo.color}90); 
          color: white; 
          padding: 20px; 
          border-radius: 8px 8px 0 0; 
          text-align: center; 
        }
        .content { 
          background: #f8f9fa; 
          padding: 30px; 
          border-radius: 0 0 8px 8px; 
          border: 1px solid #dee2e6; 
        }
        .quote-info { 
          background: white; 
          padding: 20px; 
          border-radius: 6px; 
          margin: 20px 0; 
          border-left: 4px solid ${statusInfo.color}; 
        }
        .status-badge { 
          background: ${statusInfo.color}; 
          color: white; 
          padding: 8px 16px; 
          border-radius: 20px; 
          font-weight: bold; 
          display: inline-block; 
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #dee2e6; 
          color: #6c757d; 
          font-size: 14px; 
        }
        .company-info {
          background: #343a40;
          color: white;
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${statusInfo.title}</h1>
        <p>Cotización #${quote.id}</p>
      </div>
      
      <div class="content">
        <p>Estimado/a <strong>${client.name}</strong>,</p>
        
        <p>${statusInfo.message}</p>
        
        <div class="quote-info">
          <h3>Detalles de su Cotización</h3>
          <p><strong>Número:</strong> #${quote.id}</p>
          <p><strong>Estado actual:</strong> <span class="status-badge">${quote.status}</span></p>
          <p><strong>Total:</strong> Q${parseFloat(quote.total).toFixed(2)}</p>
          ${quote.deliveryDate ? `<p><strong>Fecha estimada de entrega:</strong> ${new Date(quote.deliveryDate).toLocaleDateString('es-ES')}</p>` : ''}
          <p><strong>Fecha de actualización:</strong> ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
        </div>

        ${quote.status === 'FINALIZADA' ? `
          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <h4 style="color: #155724; margin: 0 0 10px 0;">💡 Próximo Paso</h4>
            <p style="color: #155724; margin: 0;">Su trabajo está listo. Nos pondremos en contacto para coordinar el pago y la entrega.</p>
          </div>
        ` : ''}

        ${quote.status === 'PAGADA' ? `
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <h4 style="color: #0c5460; margin: 0 0 10px 0;">🚚 Listo para Entrega</h4>
            <p style="color: #0c5460; margin: 0;">Su pago ha sido confirmado. Nos comunicaremos pronto para coordinar la entrega de su pedido.</p>
          </div>
        ` : ''}

        <p>Si tiene alguna pregunta o necesita más información, no dude en contactarnos.</p>
        
        <div class="company-info">
          <h4 style="margin: 0 0 10px 0;">${process.env.COMPANY_NAME || 'ICCSA'}</h4>
          <p style="margin: 0;">Sistema de Gestión de Pedidos</p>
        </div>
      </div>
      
      <div class="footer">
        <p>Este es un mensaje automático del sistema. Por favor, no responda a este email.</p>
        <p>© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'ICCSA'}. Todos los derechos reservados.</p>
      </div>
    </body>
    </html>
  `;
};

// Función principal para enviar email de estado
export const sendQuoteStatusEmail = async (client, quote) => {
  try {
    // 🔍 Debug: Log de los datos recibidos
    console.log(`🔍 Debug - Datos del cliente:`, { 
      name: client?.name, 
      email: client?.email,
      hasEmail: !!client?.email 
    });

    // Verificar que tenemos la configuración necesaria
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️  Configuración de email no encontrada. Email no enviado.');
      return { success: false, reason: 'missing_config' };
    }

    // Verificar que el cliente tiene email
    if (!client.email) {
      console.log(`⚠️  Cliente ${client.name} no tiene email registrado.`);
      return { success: false, reason: 'no_email' };
    }

    const transporter = createTransporter();
    
    // Generar el contenido del email
    const htmlContent = getEmailTemplate(client, quote);

    // Configurar el email
    const mailOptions = {
      from: {
        name: process.env.COMPANY_NAME || 'ICCSA',
        address: process.env.EMAIL_USER
      },
      to: client.email,
      subject: `${process.env.COMPANY_NAME || 'ICCSA'} - Estado de su Cotización #${quote.id}: ${quote.status}`,
      html: htmlContent
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email enviado a ${client.email} para cotización #${quote.id} (${quote.status})`);
    console.log(`📧 Message ID: ${info.messageId}`);

    return { 
      success: true, 
      messageId: info.messageId,
      recipient: client.email 
    };

  } catch (error) {
    console.error('❌ Error enviando email de estado:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Función para verificar configuración de email
export const checkEmailConfig = () => {
  const hasConfig = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
  
  if (!hasConfig) {
    console.log(`
╔════════════════════════════════════════╗
║        CONFIGURACIÓN DE EMAIL          ║
╠════════════════════════════════════════╣
║ Para habilitar emails automáticos,     ║
║ agrega estas variables a tu .env:      ║
║                                        ║
║ EMAIL_USER=tu-email@gmail.com          ║
║ EMAIL_PASS=tu-app-password             ║
║ COMPANY_NAME=ICCSA                     ║
║                                        ║
║ Nota: Usa App Password, no tu          ║
║ contraseña normal de Gmail             ║
╚════════════════════════════════════════╝
    `);
  }
  
  return hasConfig;
};

export default {
  sendQuoteStatusEmail,
  checkEmailConfig
};