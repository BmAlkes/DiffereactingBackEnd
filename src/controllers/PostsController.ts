import type { Request, Response } from "express";
import { Posts } from "../models/Posts";
import { fileSizeFormatter } from "../utils/fileUpload";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "landingpage2",
  api_key: "959475658351858",
  api_secret: "AR-ajbZhd7C9lidxIH-5aiLitpw",
});

export class PostsController {
  static createPost = async (req: Request, res: Response) => {
    try {
      const post = new Posts(req.body);
      console.log(req.file)

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
      post.image = fileData;
      Promise.allSettled([post.save()]);
      res.send("Post Created successfully");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts= await Posts.find()
      return res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Had a error" });
    }
  };

  static deletePost = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      console.log(postId);
      const post = await Posts.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      await post.deleteOne();
      return res.send("Post delete successfully");
    } catch (error) {
      res.status(500).send("Server error");
    }
  }

  static getPostById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const post = await Posts.findById(id);
      if (!post) {
        const error = new Error("Post not found");
        return res.status(404).json({ error: error.message });
      }

      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };


  static updatedPost = async (req: Request, res: Response) => {
    const {id} = req.params;
    console.log(id);

    try {
      const post = await Posts.findByIdAndUpdate(id, req.body);
      if (!post) {
        const error = new Error("Post not Found ");
        return res.status(404).json({ error: error.message });
      }

      res.send("Post updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  };
}

