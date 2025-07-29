import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const QuoteItem = sequelize.define(
  "QuoteItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quoteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    materialsCost: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    designFileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "quote_items",
    timestamps: true,
  },
);

export default QuoteItem;
