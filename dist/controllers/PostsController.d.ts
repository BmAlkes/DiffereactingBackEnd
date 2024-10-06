import type { Request, Response } from "express";
export declare class PostsController {
    static createPost: (req: Request, res: Response) => Promise<void>;
    static getAllPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
