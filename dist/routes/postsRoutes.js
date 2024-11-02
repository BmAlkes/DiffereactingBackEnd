"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostsController_1 = require("../controllers/PostsController");
const fileUpload_1 = require("../utils/fileUpload");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.post("/", fileUpload_1.upload.single("image"), validation_1.handleInputErros, PostsController_1.PostsController.createPost);
router.get("/", PostsController_1.PostsController.getAllPosts);
router.delete("/:postId", PostsController_1.PostsController.deletePost);
router.get("/:id", PostsController_1.PostsController.getPostById);
router.put("/:id", fileUpload_1.upload.single("image"), PostsController_1.PostsController.updatedPost);
exports.default = router;
//# sourceMappingURL=postsRoutes.js.map