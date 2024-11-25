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
  uploadMiddleware,
  [
    body("content").notEmpty().withMessage("Content is required"),
    body("media").optional().isArray(),
    body("location").optional().isObject(),
  ],
  postController.createPost
);

router.patch("/upload/:id", uploadMiddleware, postController.uploadImg);

router.patch("/:postId/:userId", postController.updateIsHide);
router.get("/", authMiddleware, postController.getAllPosts);
router.get("/sort", postController.getAllPostsNew);

router.get("/:id", postController.getPostById);
router.get("/user/:id", postController.getPostByUser);

router.get("/location/:location", postController.getPostByLocation);

router.post("/:id/like", postController.likePost);

router.get("/:id/like/user", postController.checkUserLikedPost);
router.get("/:postId/:userId/replies", postController.getRepliesController);
router.post("/:id/comment", postController.commentPost);
router.post("/:id/:commentid", postController.replyToCommentController);
router.get("/:id/like/count", postController.countLike);
router.get("/:id/comment/", postController.getPostComment);
router.get("/:id/comment/count", postController.countComment);

router.delete("/:id/comment/:commentId", postController.deleteComment);

router.delete("/:id", postController.deletePost);

module.exports = router;
