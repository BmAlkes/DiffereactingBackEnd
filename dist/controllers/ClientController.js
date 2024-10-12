"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const Clients_1 = __importDefault(require("../models/Clients"));
class ClientController {
    static createClient = async (req, res) => {
        const client = new Clients_1.default(req.body);
        try {
            await client.save();
            res.send("Client Created Success");
        }
        catch (error) {
            console.log(error);
        }
    };
    static getAllClient = async (req, res) => {
        try {
            const client = await Clients_1.default.find({});
            res.json(client);
        }
        catch (error) {
            res.status(500).send("Server error");
        }
    };
    static deleteClient = async (req, res) => {
        try {
            const { clientId } = req.params;
            console.log(clientId);
            const client = await Clients_1.default.findById(clientId);
            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }
            await client.deleteOne();
            return res.send("Client remove successfully");
        }
        catch (error) {
            res.status(500).send("Server error");
        }
    };
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const client = await Clients_1.default.findById(id);
            if (!client) {
                const error = new Error("Client not found");
                return res.status(404).json({ error: error.message });
            }
            res.json(client);
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
    static updatedClient = async (req, res) => {
        const { clientId } = req.params;
        console.log(clientId, req.body);
        try {
            const client = await Clients_1.default.findByIdAndUpdate(clientId, req.body);
            if (!client) {
                const error = new Error("Client not Found ");
                return res.status(404).json({ error: error.message });
            }
            res.send("Client updated successfully");
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
}
exports.ClientController = ClientController;
//# sourceMappingURL=ClientController.js.map