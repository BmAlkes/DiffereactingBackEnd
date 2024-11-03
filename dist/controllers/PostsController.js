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
            const { title, content, summary, terms = [], readTime = 5 } = req.body;
            let fileData = null;
            if (req.file) {
                let uploadedFile;
                try {
                    uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                        folder: "Differeacting",
                        resource_type: "image",
                    });
                    fileData = {
                        name: req.file.originalname,
                        filePath: uploadedFile.secure_url,
                        type: req.file.mimetype,
                        size: (0, fileUpload_1.fileSizeFormatter)(req.file.size, 2),
                    };
                }
                catch (e) {
                    res.status(500);
                    throw new Error(e.message);
                }
            }
            const post = new Posts_1.Post({
                title,
                content,
                summary,
                terms,
                readTime,
                image: fileData
            });
            await post.save();
            res.status(201).json({ message: "Post Created successfully", post });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    static getAllPosts = async (req, res) => {
        try {
            const posts = await Posts_1.Post.find()
                .populate('author')
                .sort({ createdAt: -1 });
            return res.json(posts);
        }
        catch (error) {
            res.status(500).json({ error: "Had an error" });
        }
    };
    static deletePost = async (req, res) => {
        try {
            const { postId } = req.params;
            const post = await Posts_1.Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            // Delete image from cloudinary if exists
            if (post.image?.filePath) {
                try {
                    const publicId = post.image.filePath.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        await cloudinary.uploader.destroy(`Differeacting/${publicId}`);
                    }
                }
                catch (error) {
                    console.error("Error deleting image from Cloudinary:", error);
                }
            }
            await Posts_1.Post.findByIdAndDelete(postId);
            return res.json({
                message: "Post deleted successfully",
                deletedPostId: postId
            });
        }
        catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    };
    static getPostById = async (req, res) => {
        const { id } = req.params;
        try {
            const post = await Posts_1.Post.findById(id)
                .populate('author');
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json(post);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Server error" });
        }
    };
    static updatedPost = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, summary, terms, readTime } = req.body;
            const post = await Posts_1.Post.findById(id);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            // Prepara o objeto de atualização
            const updateData = {
                title,
                content,
                summary,
                terms,
                readTime
            };
            if (req.file) {
                try {
                    // Delete old image if exists
                    if (post.image?.filePath) {
                        const publicId = post.image.filePath.split('/').pop()?.split('.')[0];
                        if (publicId) {
                            await cloudinary.uploader.destroy(`Differeacting/${publicId}`);
                        }
                    }
                    // Upload new image
                    const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                        folder: "Differeacting",
                        resource_type: "image",
                    });
                    const fileData = {
                        name: req.file.originalname,
                        filePath: uploadedFile.secure_url,
                        type: req.file.mimetype,
                        size: (0, fileUpload_1.fileSizeFormatter)(req.file.size, 2),
                    };
                    updateData.image = fileData;
                }
                catch (error) {
                    return res.status(500).json({
                        error: "Error uploading image",
                        details: error.message
                    });
                }
            }
            const updatedPost = await Posts_1.Post.findByIdAndUpdate(id, { $set: updateData }, { new: true }).populate('author');
            if (!updatedPost) {
                return res.status(404).json({ error: "Failed to update post" });
            }
            return res.status(200).json({
                message: "Post updated successfully",
                post: updatedPost
            });
        }
        catch (error) {
            console.error("Error updating post:", error);
            return res.status(500).json({
                error: "Server error",
                details: error.message
            });
        }
    };
}
exports.PostsController = PostsController;
//# sourceMappingURL=PostsController.js.map