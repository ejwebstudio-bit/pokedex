import { Team } from '../models/associations.js'; // ancien camino'../models/team.model.js'
import { Pokemon } from '../models/associations.js';

function computeTeamLevel(pokemons) {
  const totalStats = pokemons.reduce((sum, p) => {
    return sum + (p.hp || 0) + (p.atk || 0) + (p.def || 0)
              + (p.atk_spe || 0) + (p.def_spe || 0) + (p.speed || 0);
  }, 0);
  const level = Math.floor(totalStats / 100) + 1;
  return { totalStats, level };
}

export async function getAllTeams(req, res) {
  try {
    // Récupérer la liste des Pokemons
    const teams = await Team.findAll({
    order: [["name", "asc"]],
    include: [
      {
        model: Pokemon,
        as: "pokemons", // doit correspondre à l'alias défini dans le modèle
        through: { attributes: [] }
      },
    ],});
      
    // Ajouter level et totalStats à chaque équipe
    const enrichedTeams = teams.map(team => {
      const teamJson = team.toJSON();
      const { totalStats, level } = computeTeamLevel(teamJson.pokemons || []);
      teamJson.totalStats = totalStats;
      teamJson.level = level;
      return teamJson;
    });

    // Renvoyer la liste des teams au format JSON avec le code succès 200
    res.status(200).json(enrichedTeams);
        
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function getOneTeam(req, res) {
  try {

    // Je récupere l'ID dans les params
    const TeamId = parseInt(req.params.id);

    // Je valide l'ID
    if (!Number.isInteger(TeamId)) {
      return res.status(404).json({ error: "Team not found. Please verify the provided ID" });
    }

    // Récupérer la team by ID avec ses pokémons
    const oneTeam = await Team.findByPk(TeamId, {
      include: [
        {
          model: Pokemon,
          as: "pokemons",
          through: { attributes: [] }
        },
      ],
    });

     // Je vérifie si la team existe en BDD
    if (!oneTeam) {
    return res.status(404).json({ error: "Pokemon not found. Please verify the provided ID" });
  }
  
    // Ajouter level et totalStats
    const teamJson = oneTeam.toJSON();
    const { totalStats, level } = computeTeamLevel(teamJson.pokemons || []);
    teamJson.totalStats = totalStats;
    teamJson.level = level;

    // Renvoyer la team au format JSON avec le code succès 200
    res.status(200).json(teamJson);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function createOneTeam(req, res) { //body {"name": , "description"}
  try {
  const {name, description} = req.body;

  // Je valide si la saisie du user est bien un string non null,
  if (typeof name !== "string" || name.length === 0) {
    res.status(400).json({ error: "Property 'title' should be a non empty string" });
    return; // Puis on arrête la fonction
  }

  if (typeof description !== "string" || description.length === 0) {
    res.status(400).json({ error: "Property 'title' should be a non empty string" });
    return; // Puis on arrête la fonction
  }

  // Je créé la Team
  const createdTeam = await Team.create( {
    name: name,
    description: description
  });

  // Je renvoi la team au client avec le status code (201)
    res.status(201).json(createdTeam);

  // Renvoi d'une erreur serveur dans le cas contraire
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}


export async function addPokemonToTeam(req, res) {
  try {
  
    const { idTeam, idPokemon } = req.params;

    const teamId = parseInt(idTeam, 10);
    const pokemonId = parseInt(idPokemon, 10);

    if (isNaN(teamId) || isNaN(pokemonId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const pokemon = await Pokemon.findByPk(idPokemon);
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }


    const team = await Team.findByPk(idTeam, {
      include: [
        {
          association: "pokemons",
          include: "types",
        },
      ],
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // ✅ Vérifier AVANT d'ajouter
    if (team.pokemons.length >= 5) {
      return res.status(400).json({ error: "Team already has 5 Pokémon" });
    }

    await team.addPokemon(pokemon);
    await team.reload({ 
      include: [{
        association: "pokemons",
        include: "types"
      }]
    });

    res.status(200).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function removePokemonToTeam(req, res) {
  try {
    
    const { idTeam, idPokemon } = req.params;

    const teamId = parseInt(idTeam, 10);
    const pokemonId = parseInt(idPokemon, 10);

    if (isNaN(teamId) || isNaN(pokemonId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const pokemon = await Pokemon.findByPk(idPokemon);
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    const team = await Team.findByPk(idTeam, {
      include: [
        {
          association: "pokemons",
          include: "types",
        },
      ],
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // ✅ Vérifier AVANT d'ajouter
    if (team.pokemons.length >= 5) {
      return res.status(400).json({ error: "Team already has 5 Pokémon" });
    }

    await team.removePokemon(pokemon);
    await team.reload({ 
      include: [{
        association: "pokemons",
        include: "types"
      }]
    });

    res.status(200).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function updateTeam (req, res) {
  
  try {
  // Je récupere l'ID de la Team à Update
  const teamId = parseInt(req.params.id);

  // Je recupere les données du body {name, description}
  const {name, description} = req.body;

  // Je valide si la saisie du user est bien un string non null,
  if (typeof name !== "string" || name.length === 0) {
    res.status(400).json({ error: "Property 'name' should be a non empty string" });
    return; // Puis on arrête la fonction
  }
  
  if (typeof description !== "string" || description.length === 0) {
    res.status(400).json({ error: "Property 'description' should be a non empty string" });
    return; // Puis on arrête la fonction
  }
  
  // Je vérifie si la Team existe
  const team = await Team.findByPk(teamId);
  if (! team) {
    return res.status(404).json({ error: `Team with ID ${teamId} not found` });
  }

  // Je met à jour les données de la team et je save
  team.name = name;
  team.description = description;
  await team.save();

  // Je renvoi les données de la team mis à jour sous format JSON
  res.json(team);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function deleteTeam (req, res) {
  //res.send("ok DELETE");
  try {
    // Je récupere l'ID de la Team à Update
    const teamId = parseInt(req.params.id);

    // Je vérifie que la team existe en BDD
    const team = await Team.findByPk(teamId);
    if (! team) {
      return res.status(404).json({ error: `Team with ID ${teamId} not found` });
    }

    // Je kill la team en question
    await team.destroy();

    // Je repond au client avec le status code 204
    res.status(204).end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}