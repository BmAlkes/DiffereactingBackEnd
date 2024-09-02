"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static getAllProjects = async (req, res) => {
        const PAGE_SIZE = 6;
        try {
            const totalProjects = await Project_1.default.find({});
            const { page } = req.query;
            const projects = await Project_1.default.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            }, null, {
                skip: Number(page) * PAGE_SIZE,
                limit: PAGE_SIZE,
            }).sort();
            const totalPage = Math.floor(totalProjects.length / PAGE_SIZE);
            res.json({
                totalPage,
                data: projects,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id).populate("tasks");
            if (!project) {
                const error = new Error("Project not found");
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error("Action not allowed");
                return res.status(404).json({ error: error.message });
            }
            res.json(project);
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
    static updatedProject = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findByIdAndUpdate(id, req.body, {
                new: true,
            }).populate("tasks");
            if (!project) {
                const error = new Error("Project not found");
                return res.status(404).json({ error: error.message });
            }
            res.send("Project updated successfully");
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
    static deleteProject = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id);
            if (!project) {
                const error = new Error("Project not found");
                return res.status(404).json({ error: error.message });
            }
            await project.deleteOne();
            res.send("Project excluded");
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
    static createProject = async (req, res) => {
        const project = new Project_1.default(req.body);
        project.manager = req.user.id;
        try {
            await project.save();
            res.send("Project Created Successfully");
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map