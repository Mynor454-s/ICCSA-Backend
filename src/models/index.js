// src/models/index.js
import sequelize from "../config/db.js";

import Role from "./role.model.js";
import User from "./user.model.js";
import Client from "./client.model.js";
import Product from "./product.model.js";
import Material from "./material.model.js";
import Service from "./service.model.js";
import Quote from "./quote.model.js";
import QuoteItem from "./quoteItem.model.js";
import QuoteItemMaterial from "./quoteItemMaterial.model.js";
import QuoteService from "./quoteService.model.js";
import Payment from "./payment.model.js";

// Relaciones User - Role
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

// Relaciones Quote - User (empleado)
Quote.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Quote, { foreignKey: "userId" });

// Relaciones Quote - Client
Quote.belongsTo(Client, { foreignKey: "clientId" });
Client.hasMany(Quote, { foreignKey: "clientId" });

// Relaciones QuoteItem - Quote
QuoteItem.belongsTo(Quote, { foreignKey: "quoteId" });
Quote.hasMany(QuoteItem, { foreignKey: "quoteId" });

// Relaciones QuoteItem - Product
QuoteItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(QuoteItem, { foreignKey: "productId" });

// Relaciones QuoteItemMaterial - QuoteItem
QuoteItemMaterial.belongsTo(QuoteItem, { foreignKey: "quoteItemId" });
QuoteItem.hasMany(QuoteItemMaterial, { foreignKey: "quoteItemId" });

// Relaciones QuoteItemMaterial - Material
QuoteItemMaterial.belongsTo(Material, { foreignKey: "materialId" });
Material.hasMany(QuoteItemMaterial, { foreignKey: "materialId" });

// Relaciones QuoteService - Quote
QuoteService.belongsTo(Quote, { foreignKey: "quoteId" });
Quote.hasMany(QuoteService, { foreignKey: "quoteId" });

// Relaciones QuoteService - Service
QuoteService.belongsTo(Service, { foreignKey: "serviceId" });
Service.hasMany(QuoteService, { foreignKey: "serviceId" });

// Relaciones Payment - Quote
Payment.belongsTo(Quote, { foreignKey: "quoteId" });
Quote.hasMany(Payment, { foreignKey: "quoteId" });

export {
  sequelize,
  Role,
  User,
  Client,
  Product,
  Material,
  Service,
  Quote,
  QuoteItem,
  QuoteItemMaterial,
  QuoteService,
  Payment,
};
