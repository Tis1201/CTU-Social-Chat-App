const { validationResult } = require("express-validator");
const postService = require("../service/post.service");
const multer = require("multer");

const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content, location } = req.body;

    // Kiểm tra kiểu của location (nếu cần)
    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    // Tạo mảng media (nếu có file)
    const media = req.file
      ? [
          {
            type: req.file.mimetype.split("/")[0], // Lấy loại file (vd: "image")
            url: "/uploads/" + req.file.filename, // Đường dẫn đến file
          },
        ]
      : []; // Nếu không có file, để mảng trống

    // Tạo bài đăng mới với user_id từ req.user
    const newPost = await postService.createPost({
      user_id: req.user.id,
      content,
      media,
      location: parsedLocation, // Sử dụng giá trị đã được xử lý
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({ message: "Lỗi khi tạo bài đăng", error: {} });
  }
};

const uploadImg = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No image file uploaded" });
    }

    const postId = req.params.id;
    const filename = req.file.filename;
    // console.log('filename:::', filename)
    const updatedPost = await postService.uploadImg(postId, filename);
    res
      .status(200)
      .json({ message: "File uploaded successfully", post: updatedPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const userId = req.user.id;
    console.log("userId:::", userId);
    const posts = await postService.getAllPosts(page, limit, userId);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getAllPostsNew = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const userId = req.user.id;
    const posts = await postService.getAllPostsNew(page, limit, userId);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getPostByLocation = async (req, res) => {
  try {
    const posts = await postService.getPostByLocation(req.params.location);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const likePost = async (req, res) => {
  try {
    const post = await postService.likePost(req.params.id, req.user.id);
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const commentPost = async (req, res) => {
  try {
    const post = await postService.commentPost(
      req.params.id,
      req.body.userId,
      req.body.comment
    );
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await postService.deleteComment(
      req.params.id,
      req.body.userId,
      req.body.commentId
    );
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getPostByUser = async (req, res) => {
  try {
    const posts = await postService.getPostByUser(req.params.id);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getPostComment = async (req, res) => {
  try {
    const posts = await postService.getPostComment(req.params.id);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const checkUserLikedPost = async (req, res) => {
  try {
    const isLiked = await postService.checkUserLikedPost(
      req.params.id,
      req.user.id
    );
    res.json({ isLiked });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const countLike = async (req, res) => {
  try {
    const count = await postService.countLike(req.params.id);
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
const countComment = async (req, res) => {
  try {
    const count = await postService.countComments(req.params.id);
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const replyToCommentController = async (req, res) => {
  const { id, commentid } = req.params;
  const { userId, reply } = req.body;
  console.log("post id", id);
  try {
    // Kiểm tra xem bài viết có tồn tại không
    const post = await postService.getPostById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    const updatedPost = await postService.replyToComment(
      id,
      commentid,
      userId,
      reply
    );
    return res.status(200).json({
      message: "Reply added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "An error occurred while replying to comment",
    });
  }
};

const getRepliesController = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.params; // Lấy userId từ body hoặc có thể từ token nếu bạn dùng auth

  try {
    const replies = await postService.getRepliesByPostIdAndUserId(
      postId,
      userId
    );
    return res.status(200).json({
      message: "Replies retrieved successfully",
      replies: replies,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "An error occurred while retrieving replies",
    });
  }
};

const updateIsHide = async (req, res) => {
  const { postId, userId } = req.params;
  const post = await postService.updateIsHide(postId, userId);
  res.json(post);
};

const deletePostById = async (req, res) => {
  const post = await postService.deletePostById(req.params.id);
  res.json(post);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostByLocation,
  likePost,
  commentPost,
  deleteComment,
  deletePost,
  getPostByUser,
  uploadImg,
  checkUserLikedPost,
  countLike,
  getAllPostsNew,
  countComment,
  getPostComment,
  replyToCommentController,
  getRepliesController,
  updateIsHide,
};
