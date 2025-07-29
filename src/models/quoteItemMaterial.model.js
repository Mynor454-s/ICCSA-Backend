// src/models/quoteItemMaterial.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const QuoteItemMaterial = sequelize.define(
  "QuoteItemMaterial",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quoteItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "quote_item_materials",
    timestamps: true,
  },
);

export default QuoteItemMaterial;
