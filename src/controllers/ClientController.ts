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

  static getAllClient = async (req: Request, res: Response) => {
    try {
      const client = await Client.find({});
      res.json(client);
    } catch (error) {
      res.status(500).send("Server error");
    }
  };

  static deleteClient = async (req: Request, res: Response) => {
    try {
      const { clientId } = req.params;
      console.log(clientId);
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      await client.deleteOne();
      return res.send("Client remove successfully");
    } catch (error) {
      res.status(500).send("Server error");
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const client = await Client.findById(id);
      if (!client) {
        const error = new Error("Client not found");
        return res.status(404).json({ error: error.message });
      }

      res.json(client);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };

  static updatedClient = async (req: Request, res: Response) => {
    const { clientId } = req.params;
    console.log(clientId, req.body);
    try {
      const client = await Client.findByIdAndUpdate(clientId, req.body);
      if (!client) {
        const error = new Error("Client not Found ");
        return res.status(404).json({ error: error.message });
      }

      res.send("Client updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };
}
