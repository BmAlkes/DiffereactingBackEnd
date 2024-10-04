import type { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../email/AuthEmail";
import { generateJWT } from "../utils/jwt";
import { checkPassword, hashPassword } from "../utils/auth";
import { ServerHeartbeatSucceededEvent } from "mongodb";
import { fileSizeFormatter } from "../utils/fileUpload";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "landingpage2",
  api_key: "959475658351858",
  api_secret: "AR-ajbZhd7C9lidxIH-5aiLitpw",
});

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      // check email exist
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        const error = new Error(`User already exists`);
        return res.status(409).json({ error: error.message });
      }
      const user = new User(req.body);

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);

      // generete token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //send email

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("User created, check email for verification");
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Invalid token");
        return res.status(401).json({ error: error.message });
      }
      const user = await User.findById(tokenExist.user._id);
      user.confirmed = true;
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Account Confirmed");
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  };

  static loginAccount = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("User not found");
        return res.status(404).json({ error: error.message });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "Account not confirm, we have sent a confirmation email"
        );
        return res.status(401).json({ error: error.message });
      }

      //revisar password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error("password incorrect");
        return res.status(401).json({ error: error.message });
      }
      const token = generateJWT({ id: user.id });
      res.send(token);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      // check email exist
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const error = new Error(`User do not exists`);
        return res.status(409).json({ error: error.message });
      }
      if (user.confirmed) {
        const error = new Error("User confirmed");
        return res.status(403).json({ error: error.message });
      }

      // generete token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //send email

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("Send a new token to email");
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      // check email exist
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const error = new Error(`User do not exists`);
        return res.status(409).json({ error: error.message });
      }

      // generete token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      //send email

      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Check your email");
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Invalid token");
        return res.status(401).json({ error: error.message });
      }
      res.send("Token Valido, Define your new password");
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Invalid token");
        return res.status(401).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("Password Changed Sucessfully");
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  };

  static user = async (req: Request, res: Response) => {
    console.log(req.user )
    return res.json(req.user);
  };

  static updateProfile = async (req: Request, res: Response) => {
    const { name, email} = req.body;
   
    console.log(req.file)

    const userExists = await User.findOne({ email });

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
      } catch (e) {
        res.status(500);
        throw new Error(e.message);
      }
      fileData = {
        name: req.file.originalname,
        filePath: uploadedFile.secure_url,
        type: req.file.mimetype,
        size: fileSizeFormatter(req.file.size, 2),
      };
    }
    req.user.name = name;
    req.user.email = email;
    req.user.profileImage = fileData;

    console.log(req.user.profileImage)
    try {
      await req.user.save();
      res.send("profile updated successfully");
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("The current password is incorrect");
      return res.status(401).json({ error: error.message });
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      res.send("The password changed successfully");
    } catch (error) {
      res.status(500).send("has a error");
    }
  };

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("The password is incorrect");
      return res.status(401).json({ error: error.message });
    }

    res.send("Password Correct");
  };
}
