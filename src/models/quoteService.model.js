import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const QuoteService = sequelize.define(
  "QuoteService",
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
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "quote_services",
    timestamps: true,
  },
);

export default QuoteService;
