"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const Posts_1 = require("../models/Posts");
const fileUpload_1 = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "landingpage2",
    api_key: "959475658351858",
    api_secret: "AR-ajbZhd7C9lidxIH-5aiLitpw",
});
class PostsController {
    static createPost = async (req, res) => {
        try {
            const post = new Posts_1.Posts(req.body);
            console.log(req.file);
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
            post.image = fileData;
            Promise.allSettled([post.save()]);
            res.send("Post Created successfully");
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    static getAllPosts = async (req, res) => {
        try {
            const posts = await Posts_1.Posts.find();
            return res.json(posts);
        }
        catch (error) {
            res.status(500).json({ error: "Had a error" });
        }
    };
    static deletePost = async (req, res) => {
        try {
            const { postId } = req.params;
            console.log(postId);
            const post = await Posts_1.Posts.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            await post.deleteOne();
            return res.send("Post delete successfully");
        }
        catch (error) {
            res.status(500).send("Server error");
        }
    };
    static getPostById = async (req, res) => {
        const { id } = req.params;
        try {
            const post = await Posts_1.Posts.findById(id);
            if (!post) {
                const error = new Error("Post not found");
                return res.status(404).json({ error: error.message });
            }
            res.json(post);
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
    static updatedPost = async (req, res) => {
        const { id } = req.params;
        console.log(id);
        try {
            const post = await Posts_1.Posts.findByIdAndUpdate(id, req.body);
            if (!post) {
                const error = new Error("Post not Found ");
                return res.status(404).json({ error: error.message });
            }
            res.send("Post updated successfully");
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    };
}
exports.PostsController = PostsController;
//# sourceMappingURL=PostsController.js.map