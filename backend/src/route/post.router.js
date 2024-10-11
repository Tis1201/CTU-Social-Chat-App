const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const postController = require("../controller/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// Apply authMiddleware to all routes
router.use(authMiddleware);

router.post(
  "/",
  [
    body("content").notEmpty().withMessage("Content is required"),
    body("media").optional().isArray(),
    body("location").optional().isObject(),
  ],
  postController.createPost
);

router.patch("/upload/:id", uploadMiddleware, postController.uploadImg);

router.get("/",  postController.getAllPosts);

router.get("/user", postController.getPostByUser);

router.get("/:id", postController.getPostById);

router.get(
  "/location/:location",
  postController.getPostByLocation
);

router.post("/:id/like", postController.likePost);

router.get("/:id/like/user", postController.checkUserLikedPost);
router.post("/:id/comment", postController.commentPost);

router.get("/:id/like/count", postController.countLike);

router.delete(
  "/:id/comment/:commentId",
  postController.deleteComment
);

router.delete("/:id", postController.deletePost);



module.exports = router;
