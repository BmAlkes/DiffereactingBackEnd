import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global{
    namespace Express{
        interface Request{
            user?:IUser
        }
    }
}

export const authetication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const beared = req.headers.authorization;
  if (!beared) {
    const error = new Error("Not authorized");
    return res.status(401).json({ error: error.message });
  }
  const [,token] = beared.split(" ");

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if(typeof decode === 'object' && decode.id){
        const user = await User.findById(decode.id).select('id name email profileImage')
    if(user){
        req.user = user
    }else{
        res.status(500).json({ error:'Token not Valid'})
    }
    }
  } catch (error) {
    res.status(500).json({ error: "Token Not Valid" });
  }
  next();
};
