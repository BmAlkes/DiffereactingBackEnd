import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErros } from "../middlewares/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middlewares/project";
import { taskExists } from "../middlewares/task";
import { authetication } from "../middlewares/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { upload } from "../utils/fileUpload";

const router = Router();

router.use(authetication);

router.post(
  "/",
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErros,
  ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);
router.get("/all", ProjectController.getAllProjectsWithoutPagination);

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

// Routes  for Tasks

router.param("projectId", projectExists);

router.put(
  "/:projectId",
  upload.single("image"),
  param("projectId").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es Obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es Obligatoria"),
  handleInputErros,

  ProjectController.updatedProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  handleInputErros,

  ProjectController.deleteProject
);

router.post(
  "/:projectId/tasks",
  upload.single("image"),
  handleInputErros,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.param("taskId", taskExists);

// router.param('taskId',"")

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErros,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  handleInputErros,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",

  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErros,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID not valid"),
  body("status").notEmpty().withMessage("State is required"),
  handleInputErros,
  TaskController.updateStatus
);

// Routes for Team

router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("Email is not valid"),
  handleInputErros,
  TeamMemberController.findMemberByEmail
);

router.get("/:projectId/team", TeamMemberController.getProjectTeam);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID Not Valid"),
  handleInputErros,
  TeamMemberController.addMemberById
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("ID Not Valid"),
  handleInputErros,
  TeamMemberController.removeMemberById
);

export default router;
