import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

/**
 * Genera un código QR para una cotización
 * @param {Object} quoteData - Datos de la cotización
 * @param {number} quoteData.id - ID de la cotización
 * @param {string} quoteData.clientName - Nombre del cliente
 * @param {number} quoteData.total - Total de la cotización
 * @param {string} quoteData.status - Estado de la cotización
 * @param {string} quoteData.deliveryDate - Fecha de entrega
 * @returns {Promise<string>} - URL relativa del archivo QR generado
 */
export const generateQuoteQR = async (quoteData) => {
  try {
    // Crear el directorio uploads/qr si no existe
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const qrDir = path.join(uploadsDir, 'qr');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    // Crear la información que contendrá el QR
    const qrInfo = {
      cotizacion_id: quoteData.id,
      cliente: quoteData.clientName,
      total: `$${quoteData.total}`,
      estado: quoteData.status,
      fecha_entrega: quoteData.deliveryDate || 'No especificada',
      fecha_creacion: new Date().toLocaleDateString('es-ES'),
      // Puedes agregar una URL para ver la cotización completa
      url_detalle: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cotizaciones/${quoteData.id}`
    };

    // Convertir a JSON string para el QR
    const qrString = JSON.stringify(qrInfo, null, 2);

    // Nombre único para el archivo QR
    const fileName = `quote_${quoteData.id}_${Date.now()}.png`;
    const filePath = path.join(qrDir, fileName);

    // Generar el código QR
    await QRCode.toFile(filePath, qrString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Retornar la URL relativa
    return `/uploads/qr/${fileName}`;
  } catch (error) {
    console.error('Error generando código QR:', error);
    throw new Error('No se pudo generar el código QR');
  }
};

/**
 * Actualiza el código QR de una cotización existente
 * @param {Object} quote - Instancia de la cotización
 * @param {Object} clientData - Datos del cliente
 * @returns {Promise<string>} - Nueva URL del QR
 */
export const updateQuoteQR = async (quote, clientData) => {
  const quoteData = {
    id: quote.id,
    clientName: clientData.name,
    total: quote.total,
    status: quote.status,
    deliveryDate: quote.deliveryDate
  };

  return await generateQuoteQR(quoteData);
};

/**
 * Obtiene información de una cotización para mostrar en el frontend
 * @param {Object} quote - Instancia de la cotización con datos del cliente
 * @returns {Object} - Información formateada para mostrar
 */
export const getQRDisplayInfo = (quote) => {
  return {
    cotizacion_id: quote.id,
    cliente: quote.Client?.name || 'Cliente no disponible',
    total: `Q${quote.total}`,
    estado: quote.status,
    fecha_entrega: quote.deliveryDate ? new Date(quote.deliveryDate).toLocaleDateString('es-ES') : 'No especificada',
    fecha_creacion: new Date(quote.createdAt).toLocaleDateString('es-ES'),
    qr_url: quote.qrCodeUrl
  };
};
