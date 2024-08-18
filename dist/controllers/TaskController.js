"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const Task_1 = __importDefault(require("../models/Task"));
class TaskController {
    static createTask = async (req, res) => {
        try {
            const task = new Task_1.default(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            Promise.allSettled([task.save(), req.project.save()]);
            res.send("Task created successfully");
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    static getProjectTasks = async (req, res) => {
        try {
            const tasks = await Task_1.default.find({ project: req.project.id }).populate("project");
            return res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ error: "Had a error" });
        }
    };
    static getTaskById = async (req, res) => {
        try {
            const { taskId } = req.params;
            const tasks = await Task_1.default.findById(taskId);
            if (!tasks) {
                return res.status(404).json({ error: "Task not found" });
            }
            return res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    static updateTask = async (req, res) => {
        try {
            const { taskId } = req.params;
            const tasks = await Task_1.default.findByIdAndUpdate(taskId, req.body);
            if (!tasks) {
                return res.status(404).json({ error: "Task not found" });
            }
            return res.send("Task updated successfully");
        }
        catch (error) {
            res.status(500).json({ error: "Had a error" });
        }
    };
    static deleteTask = async (req, res) => {
        try {
            const { taskId } = req.params;
            const task = await Task_1.default.findById(taskId, req.body);
            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
            req.project.tasks = req.project.tasks.filter((task) => task.toString() !== taskId);
            await Promise.allSettled([task.deleteOne(), req.project.save()]);
            return res.send("task Deleted");
        }
        catch (error) {
            res.status(500).json({ error: "Had a error" });
        }
    };
    static updateStatus = async (req, res) => {
        try {
            const { taskId } = req.params;
            const task = await Task_1.default.findById(taskId);
            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
            const { status } = req.body;
            task.status = status;
            await task.save();
            res.send("Task Update Success");
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map