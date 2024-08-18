"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_database_1 = require("./config/mongoose.database");
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const clientProject_1 = __importDefault(require("./routes/clientProject"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./config/cors");
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
(0, mongoose_database_1.connectToDatabase)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(cors_2.corsConfig));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
//routes
app.use("/api/auth", authRoute_1.default);
app.use("/api/projects", projectRoutes_1.default);
app.use("/api/client", clientProject_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map