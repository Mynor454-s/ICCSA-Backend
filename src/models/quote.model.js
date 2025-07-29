import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Quote = sequelize.define(
  "Quote",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "CREADA",
        "ACEPTADA",
        "EN_PROCESO",
        "FINALIZADA",
        "PAGADA",
        "ENTREGADA",
      ),
      defaultValue: "CREADA",
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    qrCodeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "quotes",
    timestamps: true,
  },
);

export default Quote;
