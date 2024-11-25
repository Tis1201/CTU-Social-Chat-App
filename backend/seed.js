const mongoose = require("mongoose");
const Post = require("./src/model/post.model"); // Đường dẫn đến model Post

const uri = "mongodb://localhost:27017/myapp"; // URI kết nối MongoDB của bạn

const updateExistingPosts = async () => {
  try {
    // Kết nối tới MongoDB
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Tìm và cập nhật các bản ghi có is_hide kiểu Boolean
    const result = await Post.updateMany(
      { is_hide: { $type: "bool" } }, // Tìm các bản ghi có is_hide là Boolean
      { $set: { is_hide: [] } } // Cập nhật thành mảng rỗng
    );

    console.log(`Updated ${result.modifiedCount} posts from boolean to array format.`);

    // Ngắt kết nối sau khi hoàn tất
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error updating posts:", error);
  }
};

updateExistingPosts();
