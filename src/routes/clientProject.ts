import { Router } from "express";
import { ClientController } from "../controllers/ClientController";
import { authetication } from "../middlewares/auth";
import { handleInputErros } from "../middlewares/validation";
import { body, param } from "express-validator";

const router = Router();

router.use(authetication);

router.post("/", body("clientName").notEmpty().withMessage('Client Name is required'),
body("phone").notEmpty().withMessage("phone is required"),
  body("email").notEmpty().withMessage("email is required"),
handleInputErros ,ClientController.createClient);
router.get("/", ClientController.getAllClient);

export default router;
