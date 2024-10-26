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
const postsRoutes_1 = __importDefault(require("./routes/postsRoutes"));
const leadRoute_1 = __importDefault(require("./routes/leadRoute"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
(0, mongoose_database_1.connectToDatabase)();
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.header("Acess-Control-Allow-Methods", "*");
    res.header("Acess-Control-Allow-Headers", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Acess-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
//routes
app.use("/api/auth", authRoute_1.default);
app.use("/api/projects", express_1.default.static(path_1.default.join(__dirname, "uploads")), projectRoutes_1.default);
app.use("/api/client", clientProject_1.default);
app.use("/api/posts", express_1.default.static(path_1.default.join(__dirname, "uploads")), postsRoutes_1.default);
app.use("/api/leads", leadRoute_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map