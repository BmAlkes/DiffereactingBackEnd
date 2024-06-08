import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/mongoose.database";
import projectRoutes from "./routes/projectRoutes";
import clientRoutes from "./routes/clientProject";
import cors from "cors";
import { corsConfig } from "./cors";
import morgan from "morgan";

dotenv.config();
connectToDatabase();

const app = express();
app.use(cors(corsConfig));

app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/api/projects", projectRoutes);
app.use("/api/client", clientRoutes);

export default app;
