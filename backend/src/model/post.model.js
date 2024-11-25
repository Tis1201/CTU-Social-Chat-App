const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  replies: [
    {
      user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      comment: { type: String, required: true },
      created_at: { type: Date, default: Date.now },
    },
  ],
});

const PostSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  media: [
    {
      type: { type: String, enum: ["image", "video"] },
      url: { type: String },
    },
  ],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number] }, // [longitude, latitude]
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [CommentSchema],
  is_hide: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }]
});

PostSchema.index({ location: "2dsphere" });
PostSchema.index({ created_at: -1 });
PostSchema.index({ user_id: 1, created_at: -1, is_hide: 1 });

module.exports = mongoose.model("posts", PostSchema);
