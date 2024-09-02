import type { Request, Response } from "express";
import Client from "../models/Clients";

export class ClientController {
  static createClient = async (req: Request, res: Response) => {
    const client = new Client(req.body);
    try {
      await client.save();
      res.send("Client Created Success");
    } catch (error) {
      console.log(error);
    }
  };

  static getAllClient = async (req: Request, res: Response)=>{

    try{
      const client = await Client.find({})
      res.json(client)
    }catch(error) {
      res.status(500).send("Server error");
    }
  }
}

