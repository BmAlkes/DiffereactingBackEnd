"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthControlle_1 = require("../controllers/AuthControlle");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/create-account", (0, express_validator_1.body)("name").notEmpty().withMessage("Name can not be empty"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("Password can be less than 8 characters"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("The passwords dont match");
    }
    return true;
}), (0, express_validator_1.body)("email").isEmail().withMessage("Email not valid"), validation_1.handleInputErros, AuthControlle_1.AuthController.createAccount);
router.post("/confirm-account", (0, express_validator_1.body)("token").notEmpty().withMessage("Token can not be empty"), validation_1.handleInputErros, AuthControlle_1.AuthController.confirmAccount);
router.post("/login", (0, express_validator_1.body)("email").isEmail().withMessage("Email not valid"), (0, express_validator_1.body)("password").notEmpty().withMessage("Password cant be empty"), validation_1.handleInputErros, AuthControlle_1.AuthController.loginAccount);
router.post("/request-code", (0, express_validator_1.body)("email").isEmail().withMessage("Email not valid"), validation_1.handleInputErros, AuthControlle_1.AuthController.requestConfirmationCode);
router.post("/forgotPassword", (0, express_validator_1.body)("email").isEmail().withMessage("Email not valid"), validation_1.handleInputErros, AuthControlle_1.AuthController.forgotPassword);
router.post("/validate-token", (0, express_validator_1.body)("token").notEmpty().withMessage("Token can not be empty"), validation_1.handleInputErros, AuthControlle_1.AuthController.validateToken);
router.post("/update-password/:token", (0, express_validator_1.param)("token").isNumeric().withMessage("Invalid token"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("Password can be less than 8 characters"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("The passwords dont match");
    }
    return true;
}), validation_1.handleInputErros, AuthControlle_1.AuthController.updatePasswordWithToken);
router.get("/user", auth_1.authetication, AuthControlle_1.AuthController.user);
//Profile
router.put("/profile", auth_1.authetication, (0, express_validator_1.body)("name").notEmpty().withMessage("Name can not be empty"), (0, express_validator_1.body)("email").isEmail().withMessage("Email not valid"), validation_1.handleInputErros, AuthControlle_1.AuthController.updateProfile);
router.post("/update-password", auth_1.authetication, (0, express_validator_1.body)("current_password")
    .isLength({ min: 8 })
    .withMessage("Password can be less than 8 characters"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("The passwords dont match");
    }
    return true;
}), validation_1.handleInputErros, AuthControlle_1.AuthController.updateCurrentUserPassword);
router.post('/check-password', auth_1.authetication, (0, express_validator_1.body)('password')
    .notEmpty().withMessage('El password no puede ir vacio'), validation_1.handleInputErros, AuthControlle_1.AuthController.checkPassword);
exports.default = router;
//# sourceMappingURL=authRoute.js.map