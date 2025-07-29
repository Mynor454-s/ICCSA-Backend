import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Faltan email o contraseña" });

    // Buscar usuario por email
    const user = await User.findOne({
      where: { email },
      include: { model: User.sequelize.models.Role, attributes: ["name"] },
    });

    if (!user)
      return res.status(401).json({ message: "Credenciales inválidas" });

    // Comparar password con bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Credenciales inválidas" });

    // Generar token JWT (payload mínimo)
    const payload = {
      id: user.id,
      email: user.email,
      role: user.Role?.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Responder con token y datos mínimos
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role?.name,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
