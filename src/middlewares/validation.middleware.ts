import { Request, Response, NextFunction } from 'express';
import { TransactionType, TransactionStatus } from '../types/transaction.types';

export const validateTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, description, type, date, category, status } = req.body;
    
    if (!amount || typeof amount !== 'number' || amount < 0) {
      res.status(400).json({ error: "Valid positive amount is required" });
      return;
    }
    
    if (!description || typeof description !== 'string' || description.length < 3) {
      res.status(400).json({ error: "Description must be at least 3 characters" });
      return;
    }
    
    if (!type || !Object.values(TransactionType).includes(type)) {
      res.status(400).json({ error: "Invalid transaction type" });
      return;
    }
    
    if (!date || isNaN(new Date(date).getTime())) {
      res.status(400).json({ error: "Valid date is required" });
      return;
    }

    if (status && !Object.values(TransactionStatus).includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    
    if (req.body.isRecurring) {
      const { recurrence } = req.body;
      if (!recurrence?.interval || !recurrence?.nextDueDate) {
        res.status(400).json({ error: "Recurrence details are required for recurring transactions" });
        return;
      }
    }
    
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid request data" });
  }
};
