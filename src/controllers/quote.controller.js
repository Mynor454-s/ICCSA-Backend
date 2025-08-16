// src/controllers/quote.controller.js
import {
  Quote,
  QuoteItem,
  QuoteItemMaterial,
  QuoteService,
  Client,
  User,
  Product,
  Material,
  Service,
} from "../models/index.js";
import { generateQuoteQR, updateQuoteQR, getQRDisplayInfo } from "../utils/qrGenerator.js";

// Crear una cotización completa
export const createQuote = async (req, res) => {
  const { clientId, userId, items = [], services = [], deliveryDate } = req.body;

  if (!clientId || !userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Datos incompletos para crear la cotización" });
  }

  try {
    const quote = await Quote.create({
      clientId,
      userId,
      status: "CREADA",
      deliveryDate,
    });

    let total = 0;

    // Procesar productos (QuoteItems)
    for (const item of items) {
const { productId, quantity, unitPrice, materials = [], designFileUrl = null } = item;

      // Crear el QuoteItem con materialsCost inicial 0
      const quoteItem = await QuoteItem.create({
        quoteId: quote.id,
        productId,
        quantity,
        unitPrice,
        materialsCost: 0, // importante inicializar
        designFileUrl,
      });

      let materialsTotal = 0;

      for (const material of materials) {
        const { materialId, quantity: materialQty, unitPrice: materialPrice } = material;

        const cost = materialQty * materialPrice;

        await QuoteItemMaterial.create({
          quoteItemId: quoteItem.id,
          materialId,
          quantity: materialQty,
          unitPrice: materialPrice,
          cost,
        });

        materialsTotal += cost;
      }

      // Actualizar materialsCost del QuoteItem
      quoteItem.materialsCost = materialsTotal;
      await quoteItem.save();

      // Calcular subtotal de este item (producto + materiales)
      const itemTotal = quantity * unitPrice + materialsTotal;
      total += itemTotal;
    }

    // Procesar servicios
    for (const service of services) {
      const { serviceId, price } = service;

      await QuoteService.create({
        quoteId: quote.id,
        serviceId,
        price,
      });

      total += price;
    }

    // Actualizar total en la cotización
    quote.total = total;
    await quote.save();

    // Obtener datos del cliente para el QR
    const client = await Client.findByPk(clientId);
    
    // Generar código QR
    try {
      const qrCodeUrl = await generateQuoteQR({
        id: quote.id,
        clientName: client.name,
        total: total,
        status: quote.status,
        deliveryDate: quote.deliveryDate
      });
      
      // Actualizar la cotización con la URL del QR
      quote.qrCodeUrl = qrCodeUrl;
      await quote.save();
    } catch (qrError) {
      console.error("Error generando QR:", qrError);
      // No fallar toda la operación si el QR falla
    }

    return res.status(201).json({ 
      message: "Cotización creada correctamente", 
      quoteId: quote.id,
      qrCodeUrl: quote.qrCodeUrl 
    });
  } catch (error) {
    console.error("Error creando cotización:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener todas las cotizaciones (información resumida)
export const getAllQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clientId } = req.query;
    
    // Configurar filtros opcionales
    const whereClause = {};
    if (status) whereClause.status = status;
    if (clientId) whereClause.clientId = clientId;

    // Configurar paginación
    const offset = (page - 1) * limit;

    const { count, rows: quotes } = await Quote.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Client, 
          attributes: ["name", "email"] 
        },
        { 
          model: User, 
          attributes: ["name"] 
        }
      ],
      attributes: [
        "id", 
        "status", 
        "total", 
        "deliveryDate", 
        "qrCodeUrl",
        "createdAt",
        "updatedAt"
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      quotes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalQuotes: count,
        quotesPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error obteniendo cotizaciones:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener una cotización con todos los detalles
export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id, {
      include: [
        { model: Client, attributes: ["name", "email"] },
        { model: User, attributes: ["name", "email"] },
        {
          model: QuoteItem,
          include: [
            { model: Product, attributes: ["name"] },
            {
              model: QuoteItemMaterial,
              include: [{ model: Material, attributes: ["name"] }],
            },
          ],
        },
        {
          model: QuoteService,
          include: [{ model: Service, attributes: ["name"] }],
        },
      ],
    });

    if (!quote) return res.status(404).json({ message: "Cotización no encontrada" });

    res.json(quote);
  } catch (error) {
    console.error("Error obteniendo cotización:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar estado de una cotización
export const updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quote = await Quote.findByPk(req.params.id, {
      include: [{ model: Client, attributes: ["name"] }]
    });

    if (!quote) return res.status(404).json({ message: "Cotización no encontrada" });

    const oldStatus = quote.status;
    quote.status = status;
    await quote.save();

    // Regenerar QR si el estado cambió
    if (oldStatus !== status) {
      try {
        const qrCodeUrl = await updateQuoteQR(quote, quote.Client);
        quote.qrCodeUrl = qrCodeUrl;
        await quote.save();
      } catch (qrError) {
        console.error("Error regenerando QR:", qrError);
        // No fallar la operación si el QR falla
      }
    }

    res.json({ 
      message: "Estado actualizado correctamente", 
      status,
      qrCodeUrl: quote.qrCodeUrl 
    });
  } catch (error) {
    console.error("Error actualizando estado:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Regenerar código QR para una cotización existente
export const regenerateQuoteQR = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id, {
      include: [{ model: Client, attributes: ["name"] }]
    });

    if (!quote) return res.status(404).json({ message: "Cotización no encontrada" });

    try {
      const qrCodeUrl = await updateQuoteQR(quote, quote.Client);
      quote.qrCodeUrl = qrCodeUrl;
      await quote.save();

      res.json({ 
        message: "Código QR regenerado correctamente", 
        qrCodeUrl: quote.qrCodeUrl 
      });
    } catch (qrError) {
      console.error("Error regenerando QR:", qrError);
      res.status(500).json({ message: "Error generando código QR" });
    }
  } catch (error) {
    console.error("Error regenerando QR:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener información del código QR de una cotización
export const getQuoteQRInfo = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id, {
      include: [{ model: Client, attributes: ["name"] }]
    });

    if (!quote) return res.status(404).json({ message: "Cotización no encontrada" });

    const qrInfo = getQRDisplayInfo(quote);
    
    res.json(qrInfo);
  } catch (error) {
    console.error("Error obteniendo información del QR:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
