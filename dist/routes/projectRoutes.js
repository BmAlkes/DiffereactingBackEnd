"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middlewares/validation");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middlewares/project");
const task_1 = require("../middlewares/task");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authetication);
router.post("/", (0, express_validator_1.body)("projectName").notEmpty().withMessage("Project name is required"), (0, express_validator_1.body)("clientName").notEmpty().withMessage("Client name is required"), (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"), validation_1.handleInputErros, ProjectController_1.ProjectController.createProject);
router.get("/", ProjectController_1.ProjectController.getAllProjects);
router.get("/:id", (0, express_validator_1.param)("id").isMongoId().withMessage("ID not valid"), validation_1.handleInputErros, ProjectController_1.ProjectController.getProjectById);
router.put("/:id", (0, express_validator_1.param)("id").isMongoId().withMessage("ID not valid"), (0, express_validator_1.body)("projectName").notEmpty().withMessage("Project name is required"), (0, express_validator_1.body)("clientName").notEmpty().withMessage("Client name is required"), (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"), validation_1.handleInputErros, ProjectController_1.ProjectController.updatedProject);
router.delete("/:id", ProjectController_1.ProjectController.deleteProject);
// Routes  for Tasks
router.param("projectId", project_1.projectExists);
router.put("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("ID no válido"), (0, express_validator_1.body)("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es Obligatorio"), (0, express_validator_1.body)("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es Obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es Obligatoria"), validation_1.handleInputErros, ProjectController_1.ProjectController.updatedProject);
router.delete("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("ID no válido"), validation_1.handleInputErros, ProjectController_1.ProjectController.deleteProject);
router.post("/:projectId/tasks", (0, express_validator_1.body)("taskName")
    .notEmpty()
    .withMessage("El Nombre de la tarea es Obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es obligatoria"), validation_1.handleInputErros, TaskController_1.TaskController.createTask);
router.get("/:projectId/tasks", TaskController_1.TaskController.getProjectTasks);
router.param("taskId", task_1.taskExists);
// router.param('taskId',"")
router.get("/:projectId/tasks/:taskId", (0, express_validator_1.param)("taskId").isMongoId().withMessage("ID no válido"), validation_1.handleInputErros, TaskController_1.TaskController.getTaskById);
router.put("/:projectId/tasks/:taskId", validation_1.handleInputErros, TaskController_1.TaskController.updateTask);
router.delete("/:projectId/tasks/:taskId", (0, express_validator_1.param)("taskId").isMongoId().withMessage("ID no válido"), validation_1.handleInputErros, TaskController_1.TaskController.deleteTask);
router.post("/:projectId/tasks/:taskId/status", (0, express_validator_1.param)("taskId").isMongoId().withMessage("ID not valid"), (0, express_validator_1.body)("status").notEmpty().withMessage("State is required"), validation_1.handleInputErros, TaskController_1.TaskController.updateStatus);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map