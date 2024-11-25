// controllers/userController.js
const { validationResult } = require("express-validator");
const userService = require("../service/user.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req.body);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    const count = await userService.countFollowersAndFollowing(req.params.id);
    res.json({ user, count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No avatar file uploaded" });
    }

    const avatarUrl = await userService.updateAvatar(req.params.id, req.file);
    res.json({ msg: "Avatar updated successfully", avatar_url: avatarUrl });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

const updateBackground = async (req, res) => {
  try {
    if (!req.files || !req.files.background) {
      return res.status(400).json({ msg: "No background file uploaded" });
    }

    const backgroundUrl = await userService.updateBackground(
      req.params.id,
      req.files.background
    );
    res.json({
      msg: "Background updated successfully",
      background_url: backgroundUrl,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

const getAllUsersExceptCurrent = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user.id; // Lấy currentUserId từ middleware hoặc cách khác

    // Gọi hàm xử lý chính
    const result = await userService.fetchUsersExceptCurrent(
      currentUserId,
      page,
      limit
    );
    res.json(result);
  } catch (error) {
    console.error("Error in getAllUsersExceptCurrent controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserByGender = async (req, res) => {
  try {
    const { gender, page = 1, limit = 10 } = req.query;
    const currentUserId = req.user.id; // Lấy currentUserId từ middleware hoặc cách khác
    // Gọi hàm xử lý chính
    const result = await userService.fetchUserByGender(
      currentUserId,
      gender,
      page,
      limit
    );
    res.json(result);
  } catch (error) {
    console.error("Error in getUserByGender controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateBehavior = async (req, res) => {
  try {
    const { behavior } = req.body;
    const currentUserId = req.user.id; // Lấy currentUserId từ middleware hoặc cách khác
    const updatedUser = await userService.updateBehavior(
      currentUserId,
      behavior
    );
    res.json(updatedUser);
  } catch (error) {
    console.error("Error in updateBehavior controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBehaviorId = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getBehavior(userId);
    res.json(user);
  } catch (err) {
    console.error("Error in getBehavior controller:", err);
    res.status(500).json({ error: err.message });
  }
};
const getBehavior = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getBehavior(userId);
    res.json(user);
  } catch (err) {
    console.error("Error in getBehavior controller:", err);
    res.status(500).json({ error: err.message });
  }
};

const checkRefreshTokenHasExpired = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const isExpired = await userService.checkRefreshTokenHasExpired(
      currentUserId
    );
    res.json(isExpired);
  } catch (error) {
    console.error("Error in checkRefreshTokenHasExpired controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const avatarUrl = await userService.getUserAvatar(userId);
    res.json(avatarUrl);
  } catch (error) {
    console.error("Error in getUserAvatar controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteFollower = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.id;
    const user = await userService.unfollowUser(userId, currentUserId);
    res.json(user);
  } catch (error) {
    console.error("Error in deleteFollower controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.id;
    const user = await userService.deleteFollowing(userId, currentUserId);
    res.json(user);
  } catch (error) {
    console.error("Error in deleteFollowing controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const checkIsFollowed = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.id;
    const isFollowed = await userService.checkIsFollowed(userId, currentUserId);
    res.json(isFollowed);
  } catch (error) {
    console.error("Error in checkIsFollowed controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const countFollowersAndFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.countFollowersAndFollowing(userId);
    res.json(user);
  } catch (error) {
    console.error("Error in countFollowersAndFollowing controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const addFollower = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.id;
    const user = await userService.addFollower(userId, currentUserId);
    res.json(user);
  } catch (error) {
    console.error("Error in addFollower controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const userId = req.user.id;
    const result = await userService.getFollowingPosts(userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error in getFollowingPosts controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await userService.getUserFollowing(userId);
    res.json(following);
  } catch (error) {
    console.error("Error in getUserFollowing controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await userService.getUserFollowers(userId);
    res.json(followers);
  } catch (error) {
    console.error("Error in getUserFollowers controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.updateUserInfo(userId, req.body);
    res.json(user);
  } catch (error) {
    console.error("Error in updateUserInfo controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.deleteUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error in deleteUser controller:", error);
    res.status(500).json({ error: error.message });
  }
};

const searchUserController = async (req, res) => {
  try {
    const keyword = req.query.query || ""; 
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    const result = await userService.searchUser(keyword, page, limit); 
    res.json(result); 
  } catch (error) {
    console.error("Error in searchUserController:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateFullnameAndBio = async (req, res) => {
  const userId = req.user.id;
  const { fullname, bio } = req.body;
  const user = await userService.updateFullnameAndBio(userId, fullname, bio);
  res.json(user);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateBackground,
  getAllUsersExceptCurrent,
  getUserByGender,
  updateBehavior,
  getBehavior,
  checkRefreshTokenHasExpired,
  getUserAvatar,
  getBehaviorId,
  deleteFollower,
  deleteFollowing,
  checkIsFollowed,
  countFollowersAndFollowing,
  addFollower,
  getFollowingPosts,
  getUserFollowing,
  getUserFollowers,
  updateUserInfo,
  deleteUser,
  searchUserController,
  updateFullnameAndBio,
};
