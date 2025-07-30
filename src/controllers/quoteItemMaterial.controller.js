// src/controllers/quoteItemMaterial.controller.js
import QuoteItemMaterial from "../models/quoteItemMaterial.model.js";
import QuoteItem from "../models/quoteItem.model.js";
import Quote from "../models/quote.model.js";
import { Op } from "sequelize";

// Recalcular el costo total de materiales para un QuoteItem
async function recalculateMaterialsCost(quoteItemId) {
  const materials = await QuoteItemMaterial.findAll({ where: { quoteItemId } });

  const totalMaterialsCost = materials.reduce((sum, m) => {
    return sum + parseFloat(m.cost || 0);
  }, 0);

  await QuoteItem.update(
    { materialsCost: totalMaterialsCost.toFixed(2) },
    { where: { id: quoteItemId } }
  );

  await recalculateQuoteTotal(quoteItemId);
}

// Recalcular el total de una Quote
async function recalculateQuoteTotal(quoteItemId) {
  const quoteItem = await QuoteItem.findByPk(quoteItemId);
  if (!quoteItem) return;

  const quoteId = quoteItem.quoteId;

  const quoteItems = await QuoteItem.findAll({ where: { quoteId } });

  const itemsTotal = quoteItems.reduce((sum, item) => {
    const subtotal = item.quantity * parseFloat(item.unitPrice || 0);
    const materials = parseFloat(item.materialsCost || 0);
    return sum + subtotal + materials;
  }, 0);

  const quote = await Quote.findByPk(quoteId, {
    include: ["QuoteServices"],
  });

  const servicesTotal = quote.QuoteServices?.reduce((sum, service) => {
    return sum + parseFloat(service.price || 0);
  }, 0) || 0;

  const newTotal = itemsTotal + servicesTotal;

  await Quote.update(
    { total: newTotal.toFixed(2) },
    { where: { id: quoteId } }
  );
}

const quoteItemMaterialController = {
  async create(req, res) {
    try {
      const newItem = await QuoteItemMaterial.create(req.body);
      await recalculateMaterialsCost(newItem.quoteItemId);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const item = await QuoteItemMaterial.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Material no encontrado" });

      await item.update(req.body);
      await recalculateMaterialsCost(item.quoteItemId);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async remove(req, res) {
    try {
      const item = await QuoteItemMaterial.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Material no encontrado" });

      const quoteItemId = item.quoteItemId;
      await item.destroy();
      await recalculateMaterialsCost(quoteItemId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async findAll(req, res) {
    try {
      const items = await QuoteItemMaterial.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async findOne(req, res) {
    try {
      const item = await QuoteItemMaterial.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Material no encontrado" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default quoteItemMaterialController;
