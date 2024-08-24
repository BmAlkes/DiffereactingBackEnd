import { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email }).select("id email name");
    if (!user) {
      const error = new Error(`User ${email} not found`);
      return res.status(404).send(error.message);
    }
    res.json(user);
  };

  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project.id).populate({path:'team',
        select:'id email name'
    })

    res.json(project.team);
  };

  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    const user = await User.findById(id).select("id");
    if (!user) {
      const error = new Error(`User  not found`);
      return res.status(404).send(error.message);
    }

    if (req.project.team.some((team) => team === user.id.toString())) {
      const error = new Error(`User already in the project`);
      return res.status(404).send(error.message);
    }

    req.project.team.push(user.id);
    await req.project.save();
    res.json("User added sucessfully");
  };

  static removeMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    if (req.project.team.some((team) => team === id)) {
      const error = new Error(`User already in the project`);
      return res.status(409).send({ error: error.message });
    }
    req.project.team = req.project.team.filter(
      (teamMember) => teamMember.toString() !== id
    );

    await req.project.save();
  };
}
