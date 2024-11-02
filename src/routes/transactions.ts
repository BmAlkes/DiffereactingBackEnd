import { Router } from "express";
import Transaction from "../models/Transaction";
import { Request, Response } from "express";
import { ParsedQs } from "qs";

interface TransactionQuery extends ParsedQs {
  month?: string;
  year?: string;
  type?: string;
  page?: string;
  limit?: string;
}

interface StatsData {
    total: number;
    count: number;
  }
  
  interface FormattedStats {
    income: StatsData;
    expense: StatsData;
    balance: number;
  }
const router = Router();

// Middleware para validação
const validateTransaction = (req: Request, res: Response, next: Function) => {
  const { amount, description, type, date } = req.body;
  
  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ error: "Valid amount is required" });
  }
  
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: "Valid description is required" });
  }
  
  if (!type || !['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: "Type must be either 'income' or 'expense'" });
  }
  
  if (!date || isNaN(new Date(date).getTime())) {
    return res.status(400).json({ error: "Valid date is required" });
  }
  
  next();
};

// Get transactions with filtering and pagination
router.get("/", async (req: Request<{}, {}, {}, TransactionQuery>, res: Response) => {
  try {
    const { month, year, type, page = "1", limit = "10" } = req.query;
    const query: any = {};
    
    // Date filtering
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    
    // Type filtering
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }
    
    // Calculate pagination - convert string to number
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Transaction.countDocuments(query);
    
    res.json({
      transactions,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post("/", validateTransaction, async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get transaction by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put("/:id", validateTransaction, async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    res.json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete transaction
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    res.json({ message: "Transaction deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction statistics
router.get("/stats", async (req: Request<{}, {}, {}, TransactionQuery>, res: Response) => {
    try {
      const { month, year } = req.query;
      let dateQuery: any = {};
      
      if (month && year) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        dateQuery = {
          date: {
            $gte: startDate,
            $lte: endDate,
          }
        };
      }
      
      const stats = await Transaction.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]);
      
      const formattedStats: FormattedStats = {
        income: { total: 0, count: 0 },
        expense: { total: 0, count: 0 },
        balance: 0
      };
      
      stats.forEach(stat => {
        if (stat._id && (stat._id === 'income' || stat._id === 'expense')) {
          formattedStats[stat._id] = {
            total: stat.total,
            count: stat.count
          };
        }
      });
      
      formattedStats.balance = formattedStats.income.total - formattedStats.expense.total;
      
      res.json(formattedStats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;