const socketIo = require("socket.io");
const UserService = require("../service/user.service");
const User = require("../model/user.model");

let io;

module.exports = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
    }
  });

  io.on("connection", async (socket) => {
    console.log("A user connected");
    let userId;

    // Lắng nghe sự kiện đăng nhập từ client
    socket.on("login", async (id) => {
      userId = id; // Giả sử client gửi userId sau khi đăng nhập thành công
      console.log(userId);
      try {
        if (userId) {
          await UserService.updateUserStatus(userId, true); // Cập nhật trạng thái là online và sử dụng exec()
          console.log(`User ${userId} is online`);

          socket.emit("loginSuccess", {
            message: "Logged in successfully",
            userId,
          });
          console.log(`User ${userId} logged in successfully.`);
        } else {
          console.log(`User with ID ${userId} not found`);
        }
      } catch (error) {
        console.error("Error finding user:", error);
      }
    });

    // Khi người dùng like một bài viết
    socket.on("likePost", (postId) => {
      socket.broadcast.emit("postUpdated", postId);
    });

    // Khi ngắt kết nối
    socket.on("disconnect", async () => {
      console.log(`User ${userId} disconnected`);
      try { 
        await UserService.updateUserLastOnline(userId);
        await UserService.updateUserStatus(userId, false);
      } catch (error) {
        console.error("Error finding user during disconnect:", error);
      }
    });
  });
};

// Hàm để lấy đối tượng io
module.exports.getIo = () => {
  if (!io) {
    throw new Error("Socket not initialized!");
  }
  return io;
};
