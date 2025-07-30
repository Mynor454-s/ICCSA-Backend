import app from "./app.js";
import dotenv from "dotenv";
import { sequelize, Role, User } from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@imprenta.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Verificar conexión + sincronizar modelos + levantar servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a Railway exitosa");

    const [result] = await sequelize.query("SELECT NOW()");
    console.log("Respuesta desde PostgreSQL:", result);

    // Sincronizar todos los modelos y relaciones
    await sequelize.sync({ force: true }); // Solo usar force: true en desarrollo
    console.log("Modelos sincronizados con la base de datos");

    // Insertar roles por defecto si no existen
    const roles = await Role.findAll();
    if (roles.length === 0) {
      await Role.bulkCreate([
        { id: 1, name: "admin", description: "Administrador" },
        { id: 2, name: "empleado", description: "Empleado del negocio" },
        { id: 3, name: "cliente", description: "Cliente final" },
      ]);
      console.log("Roles insertados en la base de datos");
    }

    // Crear usuario administrador si no existe
    const existingAdmin = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (!existingAdmin) {
      await User.create({
        name: "Administrador",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        roleId: 1,
      });
      console.log(`Usuario administrador creado: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
}

startServer();
