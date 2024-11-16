import { Router } from "express";
import Transaction from "../models/Transaction";
import { Request, Response } from "express";
import { TransactionType, TransactionStatus } from "../models/Transaction";
import { authetication } from "../middlewares/auth";


const router = Router();
router.use(authetication)

// Interfaces para tipagem
interface TransactionQuery {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  category?: string;
  tags?: string[];
  isRecurring?: boolean;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Middleware de validação expandido
const validateTransaction = async (req: Request, res: Response, next: Function) => {
  const { amount, description, type, date, category, status } = req.body;
  
  try {
    // Validações básicas
    if (!amount || typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ error: "Valid positive amount is required" });
    }
    
    if (!description || typeof description !== 'string' || description.length < 3) {
      return res.status(400).json({ error: "Description must be at least 3 characters" });
    }
    
    if (!type || !Object.values(TransactionType).includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }
    
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: "Valid date is required" });
    }

    if (status && !Object.values(TransactionStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    // Validação de recorrência
    if (req.body.isRecurring) {
      const { recurrence } = req.body;
      if (!recurrence?.interval || !recurrence?.nextDueDate) {
        return res.status(400).json({ error: "Recurrence details are required for recurring transactions" });
      }
    }
    
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid request data" });
  }
};

// Rotas principais
router.get("/",  async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      type,
      status,
      category,
      tags,
      isRecurring,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query as unknown as TransactionQuery;

    // Construir query
    const query: any = {};
    
    // Filtro de data
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Outros filtros
    if (type) query.type = type;
    if (status) query.status = status;
    if (category) query.category = category;
    if (tags) query.tags = { $all: tags };
    if (isRecurring !== undefined) query.isRecurring = isRecurring;
    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {};
      if (minAmount !== undefined) query.amount.$gte = minAmount;
      if (maxAmount !== undefined) query.amount.$lte = maxAmount;
    }

    // Paginação e ordenação
    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Executar query
    const transactions = await Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Criar transação
router.post("/", [ validateTransaction], async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id
    });
    
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar transação
router.put("/:id", [ validateTransaction], async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { ...req.body, lastModifiedBy: req.user.id },
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found or unauthorized" });
    }
    
    res.json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Estatísticas e análises
router.get("/stats",  async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type, category } = req.query as TransactionQuery;
    const query: any = { createdBy: req.user.id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (type) query.type = type;
    if (category) query.category = category;

    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$category",
            month: { $month: "$date" },
            year: { $year: "$date" }
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
          minAmount: { $min: "$amount" },
          maxAmount: { $max: "$amount" }
        }
      },
      {
        $group: {
          _id: {
            type: "$_id.type",
            month: "$_id.month",
            year: "$_id.year"
          },
          categories: {
            $push: {
              category: "$_id.category",
              total: "$total",
              count: "$count",
              avgAmount: "$avgAmount",
              minAmount: "$minAmount",
              maxAmount: "$maxAmount"
            }
          },
          totalAmount: { $sum: "$total" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Projeções futuras
router.get("/projections",  async (req: Request, res: Response) => {
  try {
    const { months = 3 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + Number(months));

    const recurringTransactions = await Transaction.find({
      createdBy: req.user.id,
      isRecurring: true,
      'recurrence.endDate': { $gte: today }
    });

    const scheduledTransactions = await Transaction.find({
      createdBy: req.user.id,
      date: { $gte: today, $lte: futureDate },
      status: TransactionStatus.SCHEDULED
    });

    const projectedBalance = await calculateProjectedBalance(
      recurringTransactions,
      scheduledTransactions,
      Number(months)
    );

    res.json(projectedBalance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id',  async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    const deleteTransaction = await Transaction.findByIdAndDelete(id)
    res.json('Delete Transaction')
  }catch (error: any) {
    res.status(500).json({ error: error.message });
  }
})

// Funções auxiliares
async function calculateProjectedBalance(
  recurringTransactions: any[],
  scheduledTransactions: any[],
  months: number
) {
  // Implementar lógica de cálculo de projeção
  // Este é apenas um exemplo básico
  const projections = [];
  const today = new Date();
  
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    let monthlyTotal = 0;

    // Adicionar transações agendadas
    scheduledTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getMonth() === monthDate.getMonth() &&
          transactionDate.getFullYear() === monthDate.getFullYear()) {
        monthlyTotal += transaction.type === TransactionType.INCOME ? 
          transaction.amount : -transaction.amount;
      }
    });

    // Adicionar transações recorrentes
    recurringTransactions.forEach(transaction => {
      // Calcular ocorrências para o mês
      const occurrences = calculateRecurrenceOccurrences(transaction, monthDate);
      monthlyTotal += (transaction.type === TransactionType.INCOME ? 1 : -1) *
        transaction.amount * occurrences;
    });

    projections.push({
      month: monthDate,
      projectedBalance: monthlyTotal,
      certainty: calculateCertaintyLevel(i)
    });
  }

  return projections;
}

function calculateRecurrenceOccurrences(transaction: any, monthDate: Date): number {
  // Implementar lógica de cálculo de ocorrências baseado no intervalo
  // Este é apenas um exemplo básico
  switch (transaction.recurrence.interval) {
    case 'daily':
      return 30;
    case 'weekly':
      return 4;
    case 'biweekly':
      return 2;
    case 'monthly':
      return 1;
    case 'quarterly':
      return monthDate.getMonth() % 3 === 0 ? 1 : 0;
    case 'yearly':
      return monthDate.getMonth() === new Date(transaction.date).getMonth() ? 1 : 0;
    default:
      return 0;
  }
}

function calculateCertaintyLevel(monthsAhead: number): number {
  // Quanto mais distante no futuro, menor a certeza
  return Math.max(100 - (monthsAhead * 15), 20);
}

export default router;