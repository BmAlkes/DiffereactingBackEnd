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
const mongoose_1 = __importStar(require("mongoose"));
const ClientSchema = new mongoose_1.Schema({
    clientName: {
        type: String,
        require: true,
        trim: true,
    },
    phone: { type: String, require: true, trim: true },
    email: { type: String, require: true, trim: true },
    bankHours: { type: String, require: true, trim: true },
    description: { type: String, require: true, trim: true },
    project: [{ type: mongoose_1.Types.ObjectId, ref: "Project" }],
}, { timestamps: true });
const Client = mongoose_1.default.model("Clients", ClientSchema);
exports.default = Client;
//# sourceMappingURL=Clients.js.map