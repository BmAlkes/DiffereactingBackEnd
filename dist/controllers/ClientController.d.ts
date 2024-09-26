import type { Request, Response } from "express";
export declare class ClientController {
    static createClient: (req: Request, res: Response) => Promise<void>;
    static getAllClient: (req: Request, res: Response) => Promise<void>;
    static deleteClient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updatedClient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
