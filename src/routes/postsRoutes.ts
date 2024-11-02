import { Router } from "express";
import { PostsController } from "../controllers/PostsController";
import { upload } from "../utils/fileUpload";
import { handleInputErros } from "../middlewares/validation";

const router = Router();

router.post(
  "/",
  upload.single("image"),
  handleInputErros,
  PostsController.createPost
);
router.get("/", PostsController.getAllPosts);
router.delete("/:postId", PostsController.deletePost);
router.get("/:id", PostsController.getPostById);
router.put("/:id", upload.single("image"), PostsController.updatedPost);

export default router;
