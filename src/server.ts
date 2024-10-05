import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/mongoose.database";
import projectRoutes from "./routes/projectRoutes";
import clientRoutes from "./routes/clientProject";
import authRoutes from "./routes/authRoute";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser";

dotenv.config();
connectToDatabase();

const app = express();
app.use((req, res, next) => {
    res.header("Acess-Control-Allow-Methods", "*");
    res.header("Acess-Control-Allow-Headers", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header(
        "Acess-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use(
  "/api/projects",
  express.static(path.join(__dirname, "uploads")),
  projectRoutes
);
app.use("/api/client", clientRoutes);

export default app;
