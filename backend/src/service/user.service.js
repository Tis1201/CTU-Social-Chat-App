// services/userService.js
const User = require("../model/user.model");
const path = require("path");
const fs = require("fs");

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().select("-password").skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      users,
      page,
      limit,
      totalUsers,
      totalPages,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
};

const createUser = async (userData) => {
  let user = await User.findOne({
    $or: [{ email: userData.email }, { username: userData.username }],
  });
  if (user) {
    throw new Error("User already exists");
  }

  user = new User(userData);
  await user.save();
  return user;
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateAvatar = async (userId, avatarFile) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (avatarFile.size > maxSize) {
    throw new Error("Avatar file size must be less than 5MB");
  }

  const avatarFileName = path.join('avt', avatarFile.filename);

  user.avatar_url = avatarFileName;
  await user.save();

  return user.avatar_url;
};

const updateBackground = async (userId, backgroundFile) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (backgroundFile.size > maxSize) {
    throw new Error("Background file size must be less than 10MB");
  }


  const backgroundFileName = path.join('background', backgroundFile.filename);
  user.background_url = backgroundFileName;
  await user.save();

  return user.background_url;
};

const fetchUsersExceptCurrent = async (currentUserId, page, limit) => {
  try {
    const pageNum = parseInt(page, 10) || 1; 
    const limitNum = parseInt(limit, 10) || 10;

    // console.log(`PageNum: ${pageNum}, LimitNum: ${limitNum}`); // Log giá trị thực tế

    const skip = (pageNum - 1) * limitNum;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-password -refreshToken -refreshTokenExpires")
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalUsers = await User.countDocuments({
      _id: { $ne: currentUserId },
    });

    return {
      users,
      currentPage: pageNum,
      totalPages: Math.ceil(totalUsers / limitNum),
      totalUsers,
      limit: limitNum,
    };
  } catch (error) {
    console.error("Error in fetchUsersExceptCurrent:", error);
    throw new Error("Failed to retrieve users");
  }
};

const fetchUserByGender = async (currentUserId, gender, page, limit) => {
  try {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const skip = (pageNum - 1) * limitNum;
    if (gender === "cả hai") {
      const users = await User.find({ _id: { $ne: currentUserId } })
        .select("-password -refreshToken -refreshTokenExpires")
        .skip(skip)
        .limit(limitNum)
        .lean();

      const totalUsers = await User.countDocuments({
        _id: { $ne: currentUserId },
      });
      return {
        users,
        currentPage: pageNum,
        totalPages: Math.ceil(totalUsers / limitNum),
        totalUsers,
        limit: limitNum,
      };
    } else {
      const users = await User.find({
        gender: gender,
        _id: { $ne: currentUserId }, // Exclude the current user
      })
        .select("-password -refreshToken -refreshTokenExpires")
        .skip(skip)
        .limit(limitNum)
        .lean();

      const totalUsers = await User.countDocuments({
        gender: gender,
        _id: { $ne: currentUserId }, // Exclude the current user from count
      });

      return {
        users,
        currentPage: pageNum,
        totalPages: Math.ceil(totalUsers / limitNum),
        totalUsers,
        limit: limitNum,
      };
    }
  } catch (error) {
    console.error("Error in fetchUserByGender:", error);
    throw new Error("Failed to retrieve users");
  }
};

const countFollowers = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.followers.length;
};
const countFollowing = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.following.length;
};

const updateBehavior = async (userId, behavior) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.behavior = behavior;
  await user.save();
  return user;
};

const getBehavior = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user.behavior;
};

const checkRefreshTokenHasExpired = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return Date.now() < user.refreshTokenExpires;
}

const getUserName = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.username;
}

const getUserAvatar = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.avatar_url;
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateBackground,
  fetchUsersExceptCurrent,
  countFollowers,
  countFollowing,
  fetchUserByGender,
  updateBehavior,
  getBehavior,
  checkRefreshTokenHasExpired,
  getUserName,
  getUserAvatar,
};
