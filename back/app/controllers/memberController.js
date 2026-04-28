import { Member } from '../models/associations.js';
import { Team } from '../models/associations.js';

export async function getAllMembers(req, res) {
  try {
    const members = await Member.findAll({
      order: [["name", "asc"]],
      include: [
        {
          model: Team,
          as: "team",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function getMembersByTeam(req, res) {
  try {
    const { teamId } = req.params;

    const members = await Member.findAll({
      where: { team_id: teamId },
      order: [["name", "asc"]],
    });

    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function getOneMember(req, res) {
  try {
    const { id } = req.params;

    const member = await Member.findByPk(id, {
      include: [
        {
          model: Team,
          as: "team",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function createMember(req, res) {
  try {
    const { name, role, team_id } = req.body;

    if (!name || !team_id) {
      return res.status(400).json({ error: "Name and team_id are required" });
    }

    // Vérifier que l'équipe existe
    const team = await Team.findByPk(team_id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const member = await Member.create({ name, role, team_id });

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function updateMember(req, res) {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    if (name) member.name = name;
    if (role !== undefined) member.role = role;

    await member.save();

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}

export async function deleteMember(req, res) {
  try {
    const { id } = req.params;

    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    await member.destroy();

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
}
