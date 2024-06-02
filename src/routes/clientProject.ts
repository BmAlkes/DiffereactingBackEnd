import { Router } from "express";
import { ClientController } from "../controllers/ClientController";

const router = Router();

router.post("/", ClientController.createClient);

export default router;
