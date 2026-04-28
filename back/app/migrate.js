import { sequelize } from "./database.js";
import { DataTypes } from "sequelize";

async function migrate() {
  try {
    console.log("🔌 Connexion à PostgreSQL...");
    await sequelize.authenticate();
    console.log("✅ Connecté à PostgreSQL\n");

    // Vérifier si la table 'member' existe déjà
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    const hasMemberTable = tableExists.includes("member");

    if (!hasMemberTable) {
      console.log("⚙️  Création de la table 'member'...");

      await sequelize.getQueryInterface().createTable("member", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
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
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      });

      console.log("✅ Table 'member' créée avec succès !");
    } else {
      console.log("ℹ️  La table 'member' existe déjà, rien à faire.");
    }

    console.log("\n✨ Migration terminée !");
  } catch (error) {
    console.error("❌ Erreur lors de la migration :", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
