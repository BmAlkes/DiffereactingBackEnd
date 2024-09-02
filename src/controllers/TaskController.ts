import type { Request, Response } from "express";
import Task from "../models/Task";
import { fileSizeFormatter } from "../utils/fileUpload";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "landingpage2",
  api_key: "959475658351858",
  api_secret: "AR-ajbZhd7C9lidxIH-5aiLitpw",
});

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      console.log(task);
      task.project = req.project.id;
      req.project.tasks.push(task.id);

      // Handle Image upload
      let fileData = {};
      if (req.file) {
        //save image to cloudinary
        let uploadedFile;
        try {
          uploadedFile = await cloudinary.uploader.upload(req.file.path, {
            folder: "Differeacting",
            resource_type: "image",
          });
        } catch (e) {
          res.status(500);
          throw new Error(e.message);
        }
        fileData = {
          name: req.file.originalname,
          filePath: uploadedFile.secure_url,
          type: req.file.mimetype,
          size: fileSizeFormatter(req.file.size, 2),
        };
      }

      task.image = fileData;
      Promise.allSettled([task.save(), req.project.save()]);
      res.send(task);
      console.log(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      return res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Had a error" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const tasks = await Task.findById(taskId);
      if (!tasks) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const tasks = await Task.findByIdAndUpdate(taskId, req.body);
      if (!tasks) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.send("Task updated successfully");
    } catch (error) {
      res.status(500).json({ error: "Had a error" });
    }
  };
  static deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== taskId
      );
      await Promise.allSettled([task.deleteOne(), req.project.save()]);
      return res.send("task Deleted");
    } catch (error) {
      res.status(500).json({ error: "Had a error" });
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const { status } = req.body;
      task.status = status;
      if (status === "pending") {
        req.task.completedBy = null; 
      }
      task.completedBy = req.user.id;
      await task.save();
      res.send("Task Update Success");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
