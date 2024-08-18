import type { Request, Response } from "express";
export declare class TaskController {
    static createTask: (req: Request, res: Response) => Promise<void>;
    static getProjectTasks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getTaskById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updateTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static deleteTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updateStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
