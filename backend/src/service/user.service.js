const User = require("../model/user.model");
const path = require("path");
const fs = require("fs");
const Paginator = require("./paginator");
const Post = require("../model/post.model");
const { ObjectId } = require("mongodb");

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
  const user = await User.findById(id).select(
    "-password -refreshToken -refreshTokenExpires"
  );
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

  const avatarFileName = path.join("avt", avatarFile.filename);

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

  const backgroundFileName = path.join("background", backgroundFile.filename);
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
      const users = await User.find({
        _id: { $ne: currentUserId },
        is_online: true,
      })
        .select("-password -refreshToken -refreshTokenExpires")
        .skip(skip)
        .limit(limitNum)
        .lean();

      const totalUsers = await User.countDocuments({
        _id: { $ne: currentUserId },
        is_online: true,
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
        _id: { $ne: currentUserId }, 
        is_online: true, 
      })
        .select("-password -refreshToken -refreshTokenExpires")
        .skip(skip)
        .limit(limitNum)
        .lean();

      const totalUsers = await User.countDocuments({
        gender: gender,
        _id: { $ne: currentUserId }, 
        is_online: true, 
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

const countFollowersAndFollowing = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return {
    followers: user.followers.length,
    following: user.following.length,
  };
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
};

const getUserName = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.username;
};

const getUserAvatar = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.avatar_url;
};

const updateUserStatus = async (userId, isOnline) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.is_online = isOnline;
  await user.save();
  return user;
};

const updateUserLastOnline = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.warn(`User with ID ${userId} not found. Skipping update.`);
      return null;
    }

    user.last_online = Date.now();
    await user.save();

    return user;
  } catch (error) {
    console.error(
      `Error in updateUserLastOnline for userId ${userId}:`,
      error.message
    );
    throw error;
  }
};

const getUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.is_online;
};

const getUserLastOnline = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.last_online;
};

const checkIsFollowed = async (userId, currentUserId) => {
  const user = await User.findById(userId);
  return user.followers.includes(currentUserId);
};

const unfollowUser = async (userId, currentUserId) => {
  
  const currentUser = await User.findById(currentUserId);

  if (!currentUser) {
    throw new Error("Người dùng hiện tại không tồn tại");
  }

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== userId
  );
  await currentUser.save();

  
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Người dùng bị unfollow không tồn tại");
  }

  user.followers = user.followers.filter(
    (id) => id.toString() !== currentUserId
  );
  await user.save();

  return { currentUser, user };
};

const addFollower = async (userId, currentUserId) => {
  const user = await User.findById(userId);
  const currentUser = await User.findById(currentUserId);
  user.followers.push(currentUserId);
  currentUser.following.push(userId);
  await user.save();
  await currentUser.save();
  return user;
};

const getFollowingPosts = async (userId, page, limit) => {
  try {
    const paginator = new Paginator(page, limit);

    
    const user = await User.findById(userId).populate("following");

    if (!user) {
      throw new Error("User not found");
    }

    
    const followingUsers = user.following.map((user) => user._id);

    
    const totalRecords = await Post.countDocuments({
      user_id: { $in: followingUsers },
      is_hide: { $not: { $elemMatch: { $eq: new ObjectId(userId) } } }, 
    });

    // Lấy metadata phân trang
    const metadata = paginator.getMetadata(totalRecords);

    // Tìm bài viết, áp dụng phân trang và loại bỏ bài viết bị ẩn
    const posts = await Post.find({
      user_id: { $in: followingUsers },
      is_hide: { $not: { $elemMatch: { $eq: new ObjectId(userId) } } },
    })
      .sort({ created_at: -1 }) // Sắp xếp theo ngày tạo
      .skip(paginator.offset) // Bỏ qua số bài viết cần thiết để đạt đến trang hiện tại
      .limit(paginator.limit); // Giới hạn số bài viết trên mỗi trang

    // Lấy thêm thông tin người đăng bài và số lượng likes cho từng bài viết
    const postsWithUserData = await Promise.all(
      posts.map(async (post) => {
        const name = await getUserName(post.user_id);
        const avatar_url = await getUserAvatar(post.user_id);
        const is_online = await getUserStatus(post.user_id);
        const last_online = await getUserLastOnline(post.user_id);

        return {
          ...post.toObject(), // Chuyển đổi Mongoose document thành object thông thường
          countLike: post.likes.length,
          name,
          avatar_url,
          is_online,
          last_online,
        };
      })
    );

    return { posts: postsWithUserData, metadata };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getUserFollowing = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: "following",
      select: "-password -refreshToken -refreshTokenExpires -blocked_users",
    })
    .select("-password -refreshToken -refreshTokenExpires -blocked_users");
  return user.following;
};

const getUserFollowers = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: "followers",
      select: "-password -refreshToken -refreshTokenExpires -blocked_users",
    })
    .select("-password -refreshToken -refreshTokenExpires -blocked_users");
  return user.followers;
};

const updateUserInfo = async (userId, userData) => {
  const user = await User.findByIdAndUpdate(userId, userData, { new: true });
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  return user;
};

const searchUser = async (keyword, page = 1, limit = 10) => {
  const skip = (page - 1) * limit; 

  
  const users = await User.find({
    username: { $regex: keyword, $options: "i" },
  })
    .skip(skip) 
    .limit(limit); 

  
  const totalItems = await User.countDocuments({
    username: { $regex: keyword, $options: "i" },
  });

  
  const totalPages = Math.ceil(totalItems / limit);

  return {
    users, 
    totalItems, 
    totalPages, 
    currentPage: page, 
  };
};

const updateFullnameAndBio = async (userId, fullname, bio) => {
  const user = await User.findByIdAndUpdate(userId, { fullname, bio }, { new: true });
  return user;
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateBackground,
  fetchUsersExceptCurrent,
  countFollowersAndFollowing,
  fetchUserByGender,
  updateBehavior,
  getBehavior,
  checkRefreshTokenHasExpired,
  getUserName,
  getUserAvatar,
  updateUserStatus,
  getUserStatus,
  getUserLastOnline,
  updateUserLastOnline,
  checkIsFollowed,
  unfollowUser,
  addFollower,
  getFollowingPosts,
  getUserFollowing,
  getUserFollowers,
  updateUserInfo,
  deleteUser,
  searchUser,
  updateFullnameAndBio,
};
