import { Sequelize } from "sequelize";
import "dotenv/config";


export const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  define: {
    timestamps: false
  }
});
