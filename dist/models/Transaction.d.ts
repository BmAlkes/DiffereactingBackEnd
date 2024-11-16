/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import mongoose, { Document } from "mongoose";
export declare enum TransactionType {
    INCOME = "income",
    EXPENSE = "expense",
    FUTURE_INCOME = "future_income",
    FUTURE_EXPENSE = "future_expense",
    INVESTMENT = "investment",
    SAVINGS = "savings",
    DEBT = "debt"
}
export declare enum TransactionStatus {
    COMPLETED = "completed",
    PENDING = "pending",
    SCHEDULED = "scheduled",
    RECURRING = "recurring",
    CANCELLED = "cancelled"
}
export declare enum TransactionPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    ESSENTIAL = "essential"
}
export declare enum RecurrenceInterval {
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
    isRecurring: boolean;
    recurrence?: IRecurrence;
    paymentMethod?: string;
    account?: string;
    location?: string;
    projectedDate?: Date;
    certaintyLevel?: number;
    realizationDate?: Date;
    budget?: string;
    project?: string;
    costCenter?: string;
    notes?: string;
    attachments?: IAttachment[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastModifiedBy: string;
}
declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction> & ITransaction & Required<{
    _id: unknown;
}>, any>;
export default Transaction;
