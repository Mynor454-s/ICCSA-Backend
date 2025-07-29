import User from "../models/user.model.js";
import Role from "../models/role.model.js";

// Obtener todos los usuarios con su rol
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: { model: Role, attributes: ["name"] },
    });
    res.json({
      count: users.length,
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role?.name,
      })),
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: { model: Role, attributes: ["name"] },
    });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.Role?.name,
    });
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Crear nuevo usuario
export const createUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    const roleExists = await Role.findByPk(roleId);
    if (!roleExists) {
      return res.status(400).json({ message: "El roleId no existe" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }
    const newUser = await User.create({ name, email, password, roleId });
    const createdUser = await User.findByPk(newUser.id, {
      attributes: { exclude: ["password"] },
      include: { model: Role, attributes: ["name"] },
    });
    res.status(201).json({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.Role?.name,
    });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar usuario por ID
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (roleId) {
      const roleExists = await Role.findByPk(roleId);
      if (!roleExists)
        return res.status(400).json({ message: "El roleId no existe" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ message: "El email ya está registrado" });
      }
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    if (password) user.password = password;
    user.roleId = roleId ?? user.roleId;

    await user.save();

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] },
      include: { model: Role, attributes: ["name"] },
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.Role?.name,
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Eliminar usuario por ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    await user.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
