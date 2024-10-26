import { Router } from "express";
import Notification from "../models/Notification";
const router = Router();


export const createNotification = async (lead, type) => {
    const notification = new Notification({
      type,
      leadId: lead._id
    });
    await notification.save();
    return notification;
  };

router.get('/', async (req, res) => {
    try {
      const notifications = await Notification.find()
        .populate('leadId')
        .sort({ dateCreate: -1 })
        .limit(50);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Marcar notificação como lida
  router.patch('/:id', async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
 
 

  export default router