import type { Request, Response } from "express";
import Project from "../models/Project";
import notification from "../models/Notification";
import User from "../models/User";

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {

    try {
      const  page  = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const projects = await Project.find(
        {
          $or: [
            { manager: { $in: req.user.id } },
            { team: { $in: req.user.id } },
          ],
        },
        null,
        {
          skip,
          limit,
        }
      ).sort();
      const totalItems = await Project.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
      res.json({
        projects,
        currentPage: page,
        totalPages,
        totalItems
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };
  static getAllProjectsWithoutPagination = async (req: Request, res: Response) => {
   
    try {
      
      const projects = await Project.find()
       
      res.json(projects);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).json({ error: error.message });
      }
      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        const error = new Error("Action not allowed");
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };

  static updatedProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndUpdate(id, req.body, {
        new: true,
      }).populate("tasks");
      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).json({ error: error.message });
      }
      res.send("Project updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).json({ error: error.message });
      }
      await project.deleteOne();
      res.send("Project excluded");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };

  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    project.manager = req.user.id;

    const user = await User.findById(req.user.id);
    try {
      notification.create({
        userId: req.user.id,
        projectId: project.id,
        message: `New Project created by ${user.name}`,
      });
      //  
      await project.save();
      res.send("Project Created Successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };
}
