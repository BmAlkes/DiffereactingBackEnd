"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurrenceInterval = exports.TransactionPriority = exports.TransactionStatus = exports.TransactionType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Enums para melhor tipagem e validação
var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "income";
    TransactionType["EXPENSE"] = "expense";
    TransactionType["FUTURE_INCOME"] = "future_income";
    TransactionType["FUTURE_EXPENSE"] = "future_expense";
    TransactionType["INVESTMENT"] = "investment";
    TransactionType["SAVINGS"] = "savings";
    TransactionType["DEBT"] = "debt";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["SCHEDULED"] = "scheduled";
    TransactionStatus["RECURRING"] = "recurring";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransactionPriority;
(function (TransactionPriority) {
    TransactionPriority["LOW"] = "low";
    TransactionPriority["MEDIUM"] = "medium";
    TransactionPriority["HIGH"] = "high";
    TransactionPriority["ESSENTIAL"] = "essential";
})(TransactionPriority || (exports.TransactionPriority = TransactionPriority = {}));
var RecurrenceInterval;
(function (RecurrenceInterval) {
    RecurrenceInterval["DAILY"] = "daily";
    RecurrenceInterval["WEEKLY"] = "weekly";
    RecurrenceInterval["BIWEEKLY"] = "biweekly";
    RecurrenceInterval["MONTHLY"] = "monthly";
    RecurrenceInterval["QUARTERLY"] = "quarterly";
    RecurrenceInterval["YEARLY"] = "yearly";
})(RecurrenceInterval || (exports.RecurrenceInterval = RecurrenceInterval = {}));
const AttachmentSchema = new mongoose_1.Schema({
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
const RecurrenceSchema = new mongoose_1.Schema({
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
const TransactionSchema = new mongoose_1.Schema({
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
TransactionSchema.pre('save', function (next) {
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
const Transaction = mongoose_1.default.model('Transaction', TransactionSchema);
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map