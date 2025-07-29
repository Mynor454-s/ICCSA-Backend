// src/controllers/crud.controller.js
export function createCRUDController(Model) {
  return {
    getAll: async (req, res) => {
      try {
        const items = await Model.findAll();
        res.json(items);
      } catch (error) {
        console.error(`Error obteniendo ${Model.name}s:`, error);
        res.status(500).json({ message: "Error del servidor" });
      }
    },

    getById: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item)
          return res
            .status(404)
            .json({ message: `${Model.name} no encontrado` });
        res.json(item);
      } catch (error) {
        console.error(`Error obteniendo ${Model.name}:`, error);
        res.status(500).json({ message: "Error del servidor" });
      }
    },

    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        console.error(`Error creando ${Model.name}:`, error);
        res.status(500).json({ message: "Error del servidor" });
      }
    },

    update: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item)
          return res
            .status(404)
            .json({ message: `${Model.name} no encontrado` });

        await item.update(req.body);
        res.json(item);
      } catch (error) {
        console.error(`Error actualizando ${Model.name}:`, error);
        res.status(500).json({ message: "Error del servidor" });
      }
    },

    delete: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item)
          return res
            .status(404)
            .json({ message: `${Model.name} no encontrado` });

        await item.destroy();
        res.json({ message: `${Model.name} eliminado correctamente` });
      } catch (error) {
        console.error(`Error eliminando ${Model.name}:`, error);
        res.status(500).json({ message: "Error del servidor" });
      }
    },
  };
}

