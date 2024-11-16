"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = void 0;
const transaction_types_1 = require("../types/transaction.types");
const validateTransaction = async (req, res, next) => {
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
        if (!type || !Object.values(transaction_types_1.TransactionType).includes(type)) {
            res.status(400).json({ error: "Invalid transaction type" });
            return;
        }
        if (!date || isNaN(new Date(date).getTime())) {
            res.status(400).json({ error: "Valid date is required" });
            return;
        }
        if (status && !Object.values(transaction_types_1.TransactionStatus).includes(status)) {
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
    }
    catch (error) {
        res.status(400).json({ error: "Invalid request data" });
    }
};
exports.validateTransaction = validateTransaction;
//# sourceMappingURL=validation.middleware.js.map