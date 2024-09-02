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
}
exports.ClientController = ClientController;
//# sourceMappingURL=ClientController.js.map