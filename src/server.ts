import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/mongoose.database";
import projectRoutes from "./routes/projectRoutes";
import clientRoutes from "./routes/clientProject";
import authRoutes from "./routes/authRoute";
import postRoutes from "./routes/postsRoutes";
import leadRoutes from "./routes/leadRoute";
import event from "./routes/eventsRoute";

import notificationsRoutes from "./routes/notificationRoutes";
import transactions from "./routes/transactions";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser";
import axios from "axios";

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
app.use(
  "/api/posts",
  express.static(path.join(__dirname, "uploads")),
  postRoutes
);
app.use("/api/leads", leadRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/transactions", transactions);
app.use("/api/events", event);

export default app;
