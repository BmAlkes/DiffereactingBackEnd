"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClientController_1 = require("../controllers/ClientController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const express_validator_1 = require("express-validator");
const fileUpload_1 = require("../utils/fileUpload");
const router = (0, express_1.Router)();
router.use(auth_1.authetication);
router.post("/", fileUpload_1.upload.single('image'), (0, express_validator_1.body)("clientName").notEmpty().withMessage('Client Name is required'), (0, express_validator_1.body)("phone").notEmpty().withMessage("phone is required"), (0, express_validator_1.body)("email").notEmpty().withMessage("email is required"), validation_1.handleInputErros, ClientController_1.ClientController.createClient);
router.get("/", ClientController_1.ClientController.getAllClient);
router.get("/:id", (0, express_validator_1.param)("id").isMongoId().withMessage("ID not valid"), validation_1.handleInputErros, ClientController_1.ClientController.getProjectById);
router.delete('/:clientId', ClientController_1.ClientController.deleteClient);
router.put('/:clientId', (0, express_validator_1.param)("clientId").isMongoId().withMessage("ID no válido"), ClientController_1.ClientController.updatedClient);
exports.default = router;
//# sourceMappingURL=clientProject.js.map