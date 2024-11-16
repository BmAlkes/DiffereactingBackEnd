import mongoose, { Schema, Document } from "mongoose";

// Enums para melhor tipagem e validação
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  FUTURE_INCOME = "future_income",
  FUTURE_EXPENSE = "future_expense",
  INVESTMENT = "investment",
  SAVINGS = "savings",
  DEBT = "debt"
}

export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  SCHEDULED = "scheduled",
  RECURRING = "recurring",
  CANCELLED = "cancelled"
}

export enum TransactionPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  ESSENTIAL = "essential"
}

export enum RecurrenceInterval {
  DAILY = "daily",
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly"
}

interface IRecurrence {
  interval: RecurrenceInterval;
  nextDueDate: Date;
  endDate?: Date;
  timesRepeated: number;
  maxRepetitions?: number;
}

interface IAttachment {
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadDate: Date;
}

export interface ITransaction extends Document {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  subcategory?: string;
  date: Date;
  status: TransactionStatus;
  priority?: TransactionPriority;
  tags: string[];
  
  // Campos para transações recorrentes
  isRecurring: boolean;
  recurrence?: IRecurrence;
  
  // Campos para melhor organização
  paymentMethod?: string;
  account?: string;
  location?: string;
  
  // Campos para projeções e planejamento
  projectedDate?: Date;
  certaintyLevel?: number; // 0-100%
  realizationDate?: Date;
  
  // Campos para análise e controle
  budget?: string;
  project?: string;
  costCenter?: string;
  
  // Campos para notas e anexos
  notes?: string;
  attachments?: IAttachment[];
  
  // Campos para controle interno
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy: string;
}

const AttachmentSchema = new Schema({
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const RecurrenceSchema = new Schema({
  interval: {
    type: String,
    enum: Object.values(RecurrenceInterval),
    required: true
  },
  nextDueDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  timesRepeated: {
    type: Number,
    default: 0
  },
  maxRepetitions: {
    type: Number
  }
});

const TransactionSchema = new Schema({
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [3, "Description must be at least 3 characters long"],
    maxlength: [100, "Description cannot exceed 100 characters"]
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be greater than 0"]
  },
  type: {
    type: String,
    enum: {
      values: Object.values(TransactionType),
      message: "Invalid transaction type"
    },
    required: [true, "Type is required"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now
  },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    default: TransactionStatus.PENDING
  },
  priority: {
    type: String,
    enum: Object.values(TransactionPriority),
    default: TransactionPriority.MEDIUM
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Campos para transações recorrentes
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: RecurrenceSchema,
  
  // Campos para melhor organização
  paymentMethod: String,
  account: String,
  location: String,
  
  // Campos para projeções e planejamento
  projectedDate: Date,
  certaintyLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  realizationDate: Date,
  
  // Campos para análise e controle
  budget: String,
  project: String,
  costCenter: String,
  
  // Campos para notas e anexos
  notes: {
    type: String,
    maxlength: [1000, "Notes cannot exceed 1000 characters"]
  },
  attachments: [AttachmentSchema],
  
  // Campos para controle interno
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'transactions'
});

// Índices para melhor performance
TransactionSchema.index({ date: 1, type: 1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: 1 });
TransactionSchema.index({ tags: 1 });

// Middleware para garantir que nextDueDate seja atualizada em transações recorrentes
TransactionSchema.pre('save', function(next) {
  if (this.isRecurring && this.recurrence) {
    // Lógica para calcular próxima data com base no intervalo
    const calculateNextDueDate = () => {
      const current = new Date(this.recurrence.nextDueDate);
      switch (this.recurrence.interval) {
        case RecurrenceInterval.DAILY:
          current.setDate(current.getDate() + 1);
          break;
        case RecurrenceInterval.WEEKLY:
          current.setDate(current.getDate() + 7);
          break;
        case RecurrenceInterval.BIWEEKLY:
          current.setDate(current.getDate() + 14);
          break;
        case RecurrenceInterval.MONTHLY:
          current.setMonth(current.getMonth() + 1);
          break;
        case RecurrenceInterval.QUARTERLY:
          current.setMonth(current.getMonth() + 3);
          break;
        case RecurrenceInterval.YEARLY:
          current.setFullYear(current.getFullYear() + 1);
          break;
      }
      return current;
    };

    this.recurrence.nextDueDate = calculateNextDueDate();
    this.recurrence.timesRepeated += 1;
  }
  next();
});

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;