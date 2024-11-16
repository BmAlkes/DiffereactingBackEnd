"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const User_1 = __importDefault(require("../models/User"));
class ProjectController {
    static getAllProjects = async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const projects = await Project_1.default.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } },
                ],
            }, null, {
                skip,
                limit,
            }).sort();
            const totalItems = await Project_1.default.countDocuments();
            const totalPages = Math.ceil(totalItems / limit);
            res.json({
                projects,
                currentPage: page,
                totalPages,
                totalItems
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
    static getAllProjectsWithoutPagination = async (req, res) => {
        try {
            const projects = await Project_1.default.find();
            res.json(projects);
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
            if (project.manager.toString() !== req.user.id.toString() &&
                !project.team.includes(req.user.id)) {
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
        const user = await User_1.default.findById(req.user.id);
        try {
            //  
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