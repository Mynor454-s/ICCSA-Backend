import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payment = sequelize.define(
  "Payment",
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
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0.01, // Mínimo $0.01
      },
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    paymentMethod: {
      type: DataTypes.ENUM(
        "EFECTIVO",
        "TARJETA_CREDITO",
        "TARJETA_DEBITO",
        "TRANSFERENCIA",
        "CHEQUE",
        "DEPOSITO",
        "OTROS"
      ),
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.ENUM("PARCIAL", "COMPLETO"),
      allowNull: false,
      defaultValue: "PARCIAL",
    },
    transactionReference: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Número de referencia de la transacción (para transferencias, cheques, etc.)",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDIENTE", "CONFIRMADO", "RECHAZADO"),
      defaultValue: "CONFIRMADO",
    },
  },
  {
    tableName: "payments",
    timestamps: true,
  },
);

export default Payment;
