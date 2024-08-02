import { Router } from "express";
import { AuthController } from "../controllers/AuthControlle";
import { body, param } from "express-validator";
import { handleInputErros } from "../middlewares/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Name can not be empty"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password can be less than 8 characters"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("The passwords dont match");
    }
    return true;
  }),
  body("email").isEmail().withMessage("Email not valid"),
  handleInputErros,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("Token can not be empty"),
  handleInputErros,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email not valid"),
  body("password").notEmpty().withMessage("Password cant be empty"),
  handleInputErros,
  AuthController.loginAccount
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("Email not valid"),
  handleInputErros,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgotPassword",
  body("email").isEmail().withMessage("Email not valid"),
  handleInputErros,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("Token can not be empty"),
  handleInputErros,
  AuthController.validateToken
);
router.post(
  "/update-password/:token",
  param('token').isNumeric().withMessage('Invalid token'),
  body("password")
  .isLength({ min: 8 })
  .withMessage("Password can be less than 8 characters"),
body("password_confirmation").custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("The passwords dont match");
  }
  return true;
}),
  handleInputErros,
  AuthController.updatePasswordWithToken
);

export default router;
