const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model"); 

const authServices = {
  async registerUser(userData) {
    const { email, username } = userData;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    const newUser = new User({
      ...userData,
      refreshToken: null,
      refreshTokenExpires: null,
    });

    const accessToken = jwt.sign(
      { id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    newUser.refreshToken = refreshToken;
    newUser.refreshTokenExpires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 7 ngày

    await newUser.save();

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
      { id: user._id, avatar_url: user.avatar_url, behavior: user.behavior },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, avatar_url: user.avatar_url, behavior: user.behavior },
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
      { expiresIn: "1m" }
    );

    return { accessToken: newAccessToken };
  },
};

module.exports = authServices;
