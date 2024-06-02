import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const project = await Project.find({});
      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };
  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error(`Project not found`);
        return res.status(404).json({ error: error.message });
      }
      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };
  static updatedProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndUpdate(id, req.body);
      if (!project) {
        const error = new Error(`Project not found`);
        return res.status(404).json({ error: error.message });
      }
      await project.save();
      res.send("Project updated successfully");
    } catch (error) {
      console.log(error);
    }
  };
  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      await project.deleteOne();
      res.send("Project excluded");
    } catch (error) {
      console.log(error);
    }
  };
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    console.log(project);

    try {
      await project.save();

      res.send("Project Created Success");
    } catch (error) {
      console.log(error);
    }
  };
}
