import { Router } from "express";
import * as pokemonController from "./controllers/pokemonController.js";
import * as teamController from "./controllers/teamController.js";
import * as typeController from "./controllers/typeController.js";
import * as memberController from "./controllers/memberController.js";

export const router = Router();

//Pokemons routes
router.get("/pokemons", pokemonController.getAllPokemons);
router.get("/pokemons/:id", pokemonController.getOnePokemonAndTypes);


//Teams routes
router.get("/teams", teamController.getAllTeams);
router.get("/teams/:id", teamController.getOneTeam);

router.post("/teams", teamController.createOneTeam);
router.patch("/teams/:id", teamController.updateTeam);
router.delete("/teams/:id", teamController.deleteTeam);

router.post('/team/:idTeam/pokemon/:idPokemon', teamController.addPokemonToTeam);
router.delete('/team/:idTeam/pokemon/:idPokemon', teamController.removePokemonToTeam);

//Types routes
router.get("/types", typeController.getAllTypes);
router.get("/types/:id", typeController.getOneType);

// Members routes
router.get("/members", memberController.getAllMembers);
router.get("/members/:id", memberController.getOneMember);
router.get("/teams/:teamId/members", memberController.getMembersByTeam);
router.post("/members", memberController.createMember);
router.patch("/members/:id", memberController.updateMember);
router.delete("/members/:id", memberController.deleteMember);
