import QuoteItem from "../models/quoteItem.model.js";
import Product from "../models/product.model.js";
import Quote from "../models/quote.model.js";

// Obtener todos los productos de una cotización
export const getQuoteItems = async (req, res) => {
  try {
    const { quoteId } = req.params;
    const items = await QuoteItem.findAll({
      where: { quoteId },
      include: { model: Product, attributes: ["name", "unitPrice"] },
    });
    res.json(items);
  } catch (error) {
    console.error("Error obteniendo items:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Agregar un producto a una cotización
export const createQuoteItem = async (req, res) => {
  try {
    const { quoteId, productId, quantity, unitPrice } = req.body;

    if (!quoteId || !productId || !quantity || !unitPrice) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const quoteExists = await Quote.findByPk(quoteId);
    const productExists = await Product.findByPk(productId);

    if (!quoteExists || !productExists) {
      return res
        .status(404)
        .json({ message: "Cotización o producto no encontrado" });
    }

    const item = await QuoteItem.create({
      quoteId,
      productId,
      quantity,
      unitPrice,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Error creando quote item:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar item por ID
export const updateQuoteItem = async (req, res) => {
  try {
    const item = await QuoteItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    const { quantity, unitPrice } = req.body;

    item.quantity = quantity ?? item.quantity;
    item.unitPrice = unitPrice ?? item.unitPrice;

    await item.save();

    res.json(item);
  } catch (error) {
    console.error("Error actualizando item:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Eliminar item por ID
export const deleteQuoteItem = async (req, res) => {
  try {
    const item = await QuoteItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    await item.destroy();
    res.json({ message: "Item eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando item:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar la URL del diseño de un QuoteItem
export const updateDesignUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { designFileUrl } = req.body;

    if (!designFileUrl) {
      return res.status(400).json({ message: "Se requiere designFileUrl" });
    }

    const item = await QuoteItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "QuoteItem no encontrado" });
    }

    item.designFileUrl = designFileUrl;
    await item.save();

    res.json({
      message: "URL de diseño actualizada correctamente",
      designFileUrl: item.designFileUrl,
    });
  } catch (error) {
    console.error("Error actualizando URL del diseño:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
