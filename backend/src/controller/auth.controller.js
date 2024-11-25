const authServices = require("../service/auth.service");
const { validationResult } = require("express-validator");

const authController = {
  // Đăng ký người dùng mới
  async registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { user, accessToken, refreshToken } =
        await authServices.registerUser(req.body);
      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  async loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authServices.loginUser({
        email,
        password,
      });
      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ msg: "Refresh token is required" });
    }

    try {
      const { accessToken } = await authServices.refreshToken(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

};

module.exports = authController;
