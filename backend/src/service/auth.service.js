const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const authServices = {
  async registerUser(userData) {
    console.log("userData:", userData);
    const { email, username } = userData;

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    // Tạo người dùng mới
    const newUser = new User({
      ...userData,
      refreshToken: null,
      refreshTokenExpires: null,
    });

    // Tạo accessToken và refreshToken
    const accessToken = jwt.sign(
      {
        id: newUser._id,
        behavior: newUser.behavior,
        full_name: newUser.full_name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      {
        id: newUser._id,
        behavior: newUser.behavior,
        full_name: newUser.full_name,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Lưu refreshToken vào user
    newUser.refreshToken = refreshToken;
    newUser.refreshTokenExpires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 7 ngày

    await newUser.save();

    // Trả về thông tin user, accessToken và refreshToken
    return { user: newUser, accessToken, refreshToken };
  },

  async loginUser({ email, password }) {
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      throw new Error("Email or username already exists");
    }

    const isHashed =
      user.password.startsWith("$2a$") || user.password.startsWith("$2b$");

    let isMatch;
    if (isHashed) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;

      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
      }
    }

    console.log("Password match:", isMatch);

    if (!isMatch) {
      throw new Error("Email or password is incorrect");
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        avatar_url: user.avatar_url,
        behavior: user.behavior,
        full_name: user.full_name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
        avatar_url: user.avatar_url,
        behavior: user.behavior,
        full_name: user.full_name,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
    await user.save();

    return { user, accessToken, refreshToken };
  },

  verifyToken(token, secretKey) {
    return jwt.verify(token, secretKey);
  },

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new Error("Token is not valid");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Token is not valid");
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    return { accessToken: newAccessToken };
  },

  async getAccessToken(userId) {
    const user = await User.findById(userId);
    return user.accessToken;
  },
};

module.exports = authServices;
