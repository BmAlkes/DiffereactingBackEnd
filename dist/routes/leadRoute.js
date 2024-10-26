"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Lead_1 = __importDefault(require("../models/Lead"));
const notificationRoutes_1 = require("./notificationRoutes");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const lead = new Lead_1.default(req.body);
        await lead.save();
        await (0, notificationRoutes_1.createNotification)(lead, 'New_lead');
        res.status(201).json(lead);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Listar todos os leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead_1.default.find().sort({ dataCriacao: -1 });
        res.json(leads);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead_1.default.findById(id);
        if (!lead) {
            const error = new Error("lead not found");
            return res.status(404).json({ error: error.message });
        }
        res.json(lead);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Atualizar status do lead
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const lead = await Lead_1.default.findByIdAndUpdate(id, {
            ...req.body,
            lastUpdate: Date.now()
        }, { new: true });
        res.json(lead);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Deletar lead
router.delete('/:id', async (req, res) => {
    try {
        await Lead_1.default.findByIdAndDelete(req.params.id);
        res.status(204).json('Lead delete permanent');
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=leadRoute.js.map