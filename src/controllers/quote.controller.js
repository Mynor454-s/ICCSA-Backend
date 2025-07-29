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

    return res.status(201).json({ message: "Cotización creada correctamente", quoteId: quote.id });
  } catch (error) {
    console.error("Error creando cotización:", error);
    return res.status(500).json({ message: "Error del servidor" });
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
    const quote = await Quote.findByPk(req.params.id);

    if (!quote) return res.status(404).json({ message: "Cotización no encontrada" });

    quote.status = status;
    await quote.save();

    res.json({ message: "Estado actualizado correctamente", status });
  } catch (error) {
    console.error("Error actualizando estado:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
