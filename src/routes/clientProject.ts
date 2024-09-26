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
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID not valid"),
  handleInputErros,
 ClientController.getProjectById
);
router.delete('/:clientId', ClientController.deleteClient);
router.put('/:clientId',param("clientId").isMongoId().withMessage("ID no válido"), ClientController.updatedClient);

export default router;
