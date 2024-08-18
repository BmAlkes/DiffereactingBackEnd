import type { Request, Response, NextFunction } from "express";
import { ITask } from "../models/Task";
declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}
export declare function taskExists(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
