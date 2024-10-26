"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
const express_1 = require("express");
const Notification_1 = __importDefault(require("../models/Notification"));
const router = (0, express_1.Router)();
const createNotification = async (lead, type) => {
    const notification = new Notification_1.default({
        type,
        leadId: lead._id
    });
    await notification.save();
    return notification;
};
exports.createNotification = createNotification;
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification_1.default.find()
            .populate('leadId')
            .sort({ dateCreate: -1 })
            .limit(50);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Marcar notificação como lida
router.patch('/:id', async (req, res) => {
    try {
        const notification = await Notification_1.default.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json(notification);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map