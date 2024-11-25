const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người nhận thông báo
  related_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người đã thực hiện hành động
  type: {
    type: String,
    enum: ["new_post", "new_message", "post_commented", "post_liked"], // Thêm loại thông báo cho bình luận và thích
    required: true,
  },
  content: { type: String, required: true }, // Nội dung thông báo
  related_post_id: { type: Schema.Types.ObjectId, ref: "Post" }, // Bài viết liên quan
  created_at: { type: Date, default: Date.now }, // Thời gian tạo thông báo
  read_at: { type: Date }, // Thời gian đọc thông báo
});

module.exports = mongoose.model("Notification", NotificationSchema);
