"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const connectToDatabase = async () => {
    try {
        await mongoose_1.default.connect(`mongodb+srv://bmalkes:${process.env.DB_PASSWORD}@cluster0.u6sbs0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0,
      `);
        console.log(colors_1.default.yellow("Connect DB"));
    }
    catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=mongoose.database.js.map