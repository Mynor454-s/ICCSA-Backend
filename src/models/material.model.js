import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Material = sequelize.define(
  "Material",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    unitCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "materials",
    timestamps: true,
  },
);

export default Material;
