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
}
exports.PostsController = PostsController;
//# sourceMappingURL=PostsController.js.map