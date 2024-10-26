import { Router } from "express";
import Leads from '../models/Lead'
const router = Router();



router.post('/', async (req, res) => {
    try {
      const lead = new Leads(req.body);
      await lead.save();
      res.status(201).json(lead);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Listar todos os leads
  router.get('/', async (req, res) => {
    try {
      const leads = await Leads.find().sort({ dataCriacao: -1 });
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const lead = await Leads.findById(id)
        if(!lead){
            const error = new Error("lead not found");
        return res.status(404).json({ error: error.message });  
        }
        res.json(lead);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
  })
  
  // Atualizar status do lead
  router.patch('/:id', async (req, res) => {
    const {id} = req.params;
    try {
      const lead = await Leads.findByIdAndUpdate(
        id,
        { 
          ...req.body,
          lastUpdate: Date.now()
        },
        { new: true }
      );
      res.json(lead);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Deletar lead
  router.delete('/:id', async (req, res) => {
    try {
      await Leads.findByIdAndDelete(req.params.id);
      res.status(204).json('Lead delete permanent');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  export default router;