import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export class Member extends Model {}

Member.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "team",
      key: "id",
    },
  },
}, {
  sequelize,
  tableName: "member",
  timestamps: false,
});
