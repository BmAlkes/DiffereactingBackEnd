import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/mongoose.database";
import projectRoutes from "./routes/projectRoutes";
import clientRoutes from "./routes/clientProject";
import authRoutes from "./routes/authRoute";
import cors from "cors";
import morgan from "morgan";


dotenv.config();
connectToDatabase();

const app = express();
app.use(cors());
app.use((req,res,next)=>{
    res.header("Acess-Control-Allow-Methods","*");
    res.header("Acess-Control-Allow-Headers","GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Acess-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next()
})

app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/client", clientRoutes);

export default app;
