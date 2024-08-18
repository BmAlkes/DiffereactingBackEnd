import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/mongoose.database";
import projectRoutes from "./routes/projectRoutes";
import clientRoutes from "./routes/clientProject";
import authRoutes from "./routes/authRoute";
import cors from "cors";
import morgan from "morgan";
import configCors from '../src/default'

dotenv.config();
connectToDatabase();

const app = express();
app.use(cors({origin:"https://www.differeacting.com/"}));

app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/client", clientRoutes);

export default app;
