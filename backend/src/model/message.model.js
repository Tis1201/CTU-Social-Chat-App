const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message_type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  content: { type: String }, // Text content or URL to media
  created_at: { type: Date, default: Date.now },
  read_at: { type: Date },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  media: {
    type: { type: String, enum: ['image', 'video'] },
    url: { type: String }
  }
});

module.exports = mongoose.model('messages', MessageSchema);
    