import { Member } from "./member.model.js";

// Member belongs to Team
Member.belongsTo(Team, {
  as: "team",
  foreignKey: "team_id",
});

Team.hasMany(Member, {
  as: "members",
  foreignKey: "team_id",
});

export { Member };