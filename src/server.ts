import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/mongoose.database";
import projectRoutes from "./routes/projectRoutes";

dotenv.config();
connectToDatabase();
const app = express();
app.use(express.json());

//routes
app.use("/api/projects", projectRoutes);

export default app;
