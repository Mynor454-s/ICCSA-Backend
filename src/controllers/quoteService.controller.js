// src/controllers/quoteService.controller.js
import QuoteService from "../models/quoteService.model.js";
import Quote from "../models/quote.model.js";

const quoteServiceController = {
  async create(req, res) {
    try {
      const newService = await QuoteService.create(req.body);

      // Obtener la cotización actual
      const quote = await Quote.findByPk(newService.quoteId);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }

      // Sumar el precio del nuevo servicio al total de la cotización
      const updatedTotal = parseFloat(quote.total || 0) + parseFloat(newService.price || 0);

      await quote.update({ total: updatedTotal.toFixed(2) });

      res.status(201).json(newService);
    } catch (error) {
      console.error("Error creating QuoteService:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAll(req, res) {
    try {
      const services = await QuoteService.findAll();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const service = await QuoteService.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "QuoteService not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const service = await QuoteService.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "QuoteService not found" });
      }

      await service.update(req.body);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async remove(req, res) {
    try {
      const service = await QuoteService.findByPk(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "QuoteService not found" });
      }

      // Actualizar el total restando el servicio
      const quote = await Quote.findByPk(service.quoteId);
      if (quote) {
        const updatedTotal = parseFloat(quote.total || 0) - parseFloat(service.price || 0);
        await quote.update({ total: updatedTotal.toFixed(2) });
      }

      await service.destroy();
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default quoteServiceController;
