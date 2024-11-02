"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Transaction_1 = __importDefault(require("../models/Transaction"));
const router = (0, express_1.Router)();
// Middleware para validação
const validateTransaction = (req, res, next) => {
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
router.get("/", async (req, res) => {
    try {
        const { month, year, type, page = "1", limit = "10" } = req.query;
        const query = {};
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
        const transactions = await Transaction_1.default.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNum);
        // Get total count for pagination
        const total = await Transaction_1.default.countDocuments(query);
        res.json({
            transactions,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Create transaction
router.post("/", validateTransaction, async (req, res) => {
    try {
        const transaction = new Transaction_1.default(req.body);
        await transaction.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get transaction by ID
router.get("/:id", async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update transaction
router.put("/:id", validateTransaction, async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json(transaction);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Delete transaction
router.delete("/:id", async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get transaction statistics
router.get("/stats", async (req, res) => {
    try {
        const { month, year } = req.query;
        let dateQuery = {};
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
        const stats = await Transaction_1.default.aggregate([
            { $match: dateQuery },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        const formattedStats = {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map