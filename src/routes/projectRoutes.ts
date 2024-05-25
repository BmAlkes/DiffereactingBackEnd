import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErros } from "../middlewares/validation";

const router = Router();

router.post(
  "/",
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErros,
  ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID not valid"),
  handleInputErros,
  ProjectController.getProjectById
);
router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID not valid"),
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErros,
  ProjectController.updatedProject
);
router.delete("/:id", ProjectController.deleteProject);

export default router;
