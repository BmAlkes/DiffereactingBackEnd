import express, { Request, Response } from "express";
import Event, { IEvent } from "../models/events";
import { authetication } from "../middlewares/auth";


const router = express.Router();

router.use(authetication);

interface EventRequestBody {
  title: string;
  date: string;
  description?: string;
  category: 'Work' | 'Personal' | 'Important' | 'Meeting' | 'Others';
  reminder: boolean;
  reminderTime: string;
}

interface MonthParams {
  year: string;
  month: string;
}

// Buscar eventos do usuário
router.get("/", async (req, res: Response) => {
  try {
    const events = await Event.find({ user: req.user?.id }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: "Erro ao buscar eventos" });
  }
});

// Buscar eventos por mês
router.get("/month/:year/:month", async (req, res: Response) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const events = await Event.find({
      user: req.user?.id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error('Error fetching monthly events:', error);
    res.status(500).json({ message: "Erro ao buscar eventos" });
  }
});

// Criar novo evento
router.post("/", async (req, res: Response) => {
  try {
    const { title, date, description, category, reminder, reminderTime } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Título e data são obrigatórios" });
    }

    const event = new Event({
      user: req.user?.id,
      title,
      date,
      description,
      category,
      reminder,
      reminderTime,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: "Erro ao criar evento" });
  }
});

// Atualizar evento
router.put("/:id", async (req,  res: Response) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user?.id,
    });

    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        notified: false, // resetar notificação se o evento for atualizado
        user: req.user?.id // garantir que o usuário não seja alterado
      },
      { 
        new: true,
        runValidators: true // executar validações do schema
      }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: "Erro ao atualizar evento" });
  }
});

// Deletar evento
router.delete("/:id", async (req, res: Response) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user?.id,
    });

    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: "Evento removido com sucesso" });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: "Erro ao deletar evento" });
  }
});

export default router;