"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskExists = void 0;
const Task_1 = __importDefault(require("../models/Task"));
async function taskExists(req, res, next) {
    try {
        const { taskId } = req.params;
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            const error = new Error("Task not Found");
            return res.status(404).json({ error: error.message });
        }
        req.task = task;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "have a error" });
    }
}
exports.taskExists = taskExists;
//# sourceMappingURL=task.js.map