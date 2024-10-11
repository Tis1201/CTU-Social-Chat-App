const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, quyền truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });

    if (Date.now() >= decoded.exp * 1000) {
      const User = require("../model/user.model");
      const user = await User.findById(decoded.id);
      if (!user || !user.refreshToken) {
        return res
          .status(401)
          .json({ message: "Access token hết hạn và không có refresh token" });
      }

      try {
        const authServices = require("../service/auth.service");
        const { accessToken } = await authServices.refreshToken(
          user.refreshToken
        );

        res.setHeader("X-New-Access-Token", accessToken);

        const newDecoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        req.user = newDecoded;
      } catch (refreshError) {
        console.log("Refresh Token Failed:", refreshError.message);
        return res
          .status(403)
          .json({ message: "Không thể làm mới token, vui lòng đăng nhập lại" });
      }
    } else {
      req.user = decoded;
    }

    next();
  } catch (error) {
    console.log("Token Error:", error.message);
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};



module.exports = authMiddleware;
