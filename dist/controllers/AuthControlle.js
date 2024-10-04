"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../email/AuthEmail");
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../utils/auth");
const fileUpload_1 = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "landingpage2",
    api_key: "959475658351858",
    api_secret: "AR-ajbZhd7C9lidxIH-5aiLitpw",
});
class AuthController {
    static createAccount = async (req, res) => {
        try {
            // check email exist
            const userExists = await User_1.default.findOne({ email: req.body.email });
            if (userExists) {
                const error = new Error(`User already exists`);
                return res.status(409).json({ error: error.message });
            }
            const user = new User_1.default(req.body);
            // Hash password
            const salt = await bcrypt_1.default.genSalt(10);
            user.password = await bcrypt_1.default.hash(req.body.password, salt);
            // generete token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //send email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.send("User created, check email for verification");
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
    static confirmAccount = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error("Invalid token");
                return res.status(401).json({ error: error.message });
            }
            const user = await User_1.default.findById(tokenExist.user._id);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send("Account Confirmed");
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
    static loginAccount = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("User not found");
                return res.status(404).json({ error: error.message });
            }
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                await token.save();
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                });
                const error = new Error("Account not confirm, we have sent a confirmation email");
                return res.status(401).json({ error: error.message });
            }
            //revisar password
            const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error("password incorrect");
                return res.status(401).json({ error: error.message });
            }
            const token = (0, jwt_1.generateJWT)({ id: user.id });
            res.send(token);
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            // check email exist
            const user = await User_1.default.findOne({ email: req.body.email });
            if (!user) {
                const error = new Error(`User do not exists`);
                return res.status(409).json({ error: error.message });
            }
            if (user.confirmed) {
                const error = new Error("User confirmed");
                return res.status(403).json({ error: error.message });
            }
            // generete token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //send email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.send("Send a new token to email");
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            // check email exist
            const user = await User_1.default.findOne({ email: req.body.email });
            if (!user) {
                const error = new Error(`User do not exists`);
                return res.status(409).json({ error: error.message });
            }
            // generete token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            await token.save();
            //send email
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            res.send("Check your email");
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error("Invalid token");
                return res.status(401).json({ error: error.message });
            }
            res.send("Token Valido, Define your new password");
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error("Invalid token");
                return res.status(401).json({ error: error.message });
            }
            const user = await User_1.default.findById(tokenExist.user);
            const salt = await bcrypt_1.default.genSalt(10);
            user.password = await bcrypt_1.default.hash(password, salt);
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send("Password Changed Sucessfully");
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
    static user = async (req, res) => {
        console.log(req.user);
        return res.json(req.user);
    };
    static updateProfile = async (req, res) => {
        const { name, email } = req.body;
        console.log(req.file);
        const userExists = await User_1.default.findOne({ email });
        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error(`This email is already register `);
            return res.status(409).json({ error: error.message });
        }
        let fileData = {};
        if (req.file) {
            //save image to cloudinary
            let uploadedFile;
            try {
                uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                    folder: "Differeacting",
                    resource_type: "image",
                });
            }
            catch (e) {
                res.status(500);
                throw new Error(e.message);
            }
            fileData = {
                name: req.file.originalname,
                filePath: uploadedFile.secure_url,
                type: req.file.mimetype,
                size: (0, fileUpload_1.fileSizeFormatter)(req.file.size, 2),
            };
        }
        req.user.name = name;
        req.user.email = email;
        req.user.profileImage = fileData;
        console.log(req.user.profileImage);
        try {
            await req.user.save();
            res.send("profile updated successfully");
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("The current password is incorrect");
            return res.status(401).json({ error: error.message });
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.send("The password changed successfully");
        }
        catch (error) {
            res.status(500).send("has a error");
        }
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("The password is incorrect");
            return res.status(401).json({ error: error.message });
        }
        res.send("Password Correct");
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthControlle.js.map