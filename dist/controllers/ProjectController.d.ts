import type { Request, Response } from "express";
export declare class ProjectController {
    static getAllProjects: (req: Request, res: Response) => Promise<void>;
    static getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updatedProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static deleteProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static createProject: (req: Request, res: Response) => Promise<void>;
}
