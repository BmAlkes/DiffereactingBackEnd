"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClientController_1 = require("../controllers/ClientController");
const router = (0, express_1.Router)();
router.post("/", ClientController_1.ClientController.createClient);
exports.default = router;
//# sourceMappingURL=clientProject.js.map