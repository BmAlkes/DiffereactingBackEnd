import type { Request, Response } from "express";
export declare class ClientController {
    static createClient: (req: Request, res: Response) => Promise<void>;
    static getAllClient: (req: Request, res: Response) => Promise<void>;
}
