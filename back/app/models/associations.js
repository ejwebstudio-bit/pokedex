import { Pokemon } from "./pokemon.model.js";
import { Team } from "./team.model.js";
import { Type } from "./type.model.js";
import { Member } from "./member.model.js";


Pokemon.belongsToMany(Type, {
    as : "types",
    through:"pokemon_type",
    foreignKey:'pokemon_id'
});

Type.belongsToMany(Pokemon, {
    as: "pokemons",
    through:"pokemon_type",
    foreignKey:"type_id"
});

Pokemon.belongsToMany(Team, {
    as: "teams",
    through:"team_pokemon",
    foreignKey: "pokemon_id",
})

Team.belongsToMany(Pokemon, {
    as:"pokemons",
    through:"team_pokemon",
    foreignKey:"team_id"
});

// Member associations
Member.belongsTo(Team, {
  as: "team",
  foreignKey: "team_id",
});

Team.hasMany(Member, {
  as: "members",
  foreignKey: "team_id",
});

export { Pokemon, Type, Team, Member };
