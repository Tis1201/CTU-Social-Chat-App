const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  last_message: {
    message_id: { type: Schema.Types.ObjectId, ref: 'Message' },
    content: { type: String },
    created_at: { type: Date }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date }
});

module.exports = mongoose.model('conversations', ConversationSchema);
