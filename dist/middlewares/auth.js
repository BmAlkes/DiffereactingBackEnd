"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authetication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authetication = async (req, res, next) => {
    const beared = req.headers.authorization;
    if (!beared) {
        const error = new Error("Not authorized");
        return res.status(401).json({ error: error.message });
    }
    const [, token] = beared.split(" ");
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decode === 'object' && decode.id) {
            const user = await User_1.default.findById(decode.id).select('id name email');
            if (user) {
                req.user = user;
                console.log(user);
            }
            else {
                res.status(500).json({ error: 'Token not Valid' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: "Token Not Valid" });
    }
    next();
};
exports.authetication = authetication;
//# sourceMappingURL=auth.js.map