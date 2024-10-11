const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['new_post', 'new_message'], required: true },
  content: { type: String, required: true },
  related_post_id: { type: Schema.Types.ObjectId, ref: 'Post' },
  created_at: { type: Date, default: Date.now },
  read_at: { type: Date }
});

module.exports = mongoose.model('notifications', NotificationSchema);
