import app from "./app.js";
import dotenv from "dotenv";
import { sequelize, Role } from "./models/index.js"; // 👈 importar desde index.js

dotenv.config();

const PORT = process.env.PORT || 3000;

// Verificar conexión + sincronizar modelos + levantar servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a Railway exitosa");

    const [result] = await sequelize.query("SELECT NOW()");
    console.log("🕒 Respuesta desde PostgreSQL:", result);

    // Sincronizar todos los modelos y relaciones
    await sequelize.sync({ force: true });
    console.log("📦 Modelos sincronizados con la base de datos");

    // Poblar tabla de roles si está vacía
    const roles = await Role.findAll();
    if (roles.length === 0) {
      await Role.bulkCreate([
        { id: 1, name: "admin", description: "Administrador" },
        { id: 2, name: "empleado", description: "Empleado del negocio" },
        { id: 3, name: "cliente", description: "Cliente final" },
      ]);
      console.log("🛡️ Roles insertados en la base de datos");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  }
}

startServer();
