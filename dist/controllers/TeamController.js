"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
class TeamMemberController {
    static findMemberByEmail = async (req, res) => {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email: email }).select("id email name");
        if (!user) {
            const error = new Error(`User ${email} not found`);
            return res.status(409).json({ error: error.message });
        }
        res.json(user);
    };
    static getProjectTeam = async (req, res) => {
        const project = await Project_1.default.findById(req.project.id).populate({
            path: "team",
            select: "id email name",
        });
        res.json(project.team);
    };
    static addMemberById = async (req, res) => {
        const { id } = req.body;
        const user = await User_1.default.findById(id).select("id");
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
    static removeMemberById = async (req, res) => {
        const { id } = req.body;
        if (req.project.team.some((team) => team === id)) {
            const error = new Error(`User already in the project`);
            return res.status(409).send({ error: error.message });
        }
        req.project.team = req.project.team.filter((teamMember) => teamMember.toString() !== id);
        await req.project.save();
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map