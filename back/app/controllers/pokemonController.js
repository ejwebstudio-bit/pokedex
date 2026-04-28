import { Op } from "sequelize";
import { Pokemon } from "../models/associations.js"; //anciennent "../models/pokemon.model.js"
import { Type } from '../models/type.model.js';



export async function getAllPokemons(req, res) {
    try {
        const { name, typeId } = req.query;

        // Construire la clause WHERE
        const whereClause = {};
        if (name) {
          whereClause.name = { [Op.iLike]: `%${name}%` };
        }

        // Construire la clause include (filtrage sur type si nécessaire)
        const includeClause = [
          {
            model: Type,
            as: "types",
            attributes: ["id", "name", "color"],
            through: { attributes: [] },
          },
        ];

        if (typeId) {
          includeClause[0].where = { id: parseInt(typeId) };
        }

        // Récupérer la liste des Pokemons
        const pokemons = await Pokemon.findAll({
          where: whereClause,
          order: [["id", "asc"]],
          include: includeClause,
        });
      
        // Renvoyer la liste des Pokemons au format JSON avec le code succès 200
        res.status(200).json(pokemons);
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unexpected server error" });
      }
    }

export async function getOnePokemon(req, res) {
  try {
      //res.send("ok");

    // Je récupere l'ID dans les params
    const pokeId = parseInt(req.params.id);

    // Je valide l'ID
    if (!Number.isInteger(pokeId)) {
      return res.status(404).json({ error: "Pokemon not found. Please verify the provided ID" });
    }

    // Récupérer le Pokemon by ID
    const onePokemon = await Pokemon.findByPk(pokeId);

     // Je vérifie si le Pokemon existe en BDD
    if (! onePokemon) {
    return res.status(404).json({ error: "Pokemon not found. Please verify the provided ID" });
  }
  
    // Renvoyer le Pokemon au format JSON avec le code succès 200
    res.status(200).json(onePokemon);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function getOnePokemonAndTypes (req, res) {
  const pokeId = parseInt(req.params.id);
  // Récupérer le Pokemon by ID
  const onePokemonAndTypes = await Pokemon.findByPk(
    pokeId, {"include": ["types"]});

  // Je vérifie si le Pokemon existe en BDD
  if (! onePokemonAndTypes) {
  return res.status(404).json({ error: "Pokemon not found. Please verify the provided ID" });
}

  // Renvoyer le Pokemon au format JSON avec le code succès 200
  res.status(200).json(onePokemonAndTypes);
}