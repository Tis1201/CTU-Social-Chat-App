const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CallSchema = new Schema({
  caller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  call_type: { type: String, enum: ['audio', 'video'], default: 'audio' },
  call_start: { type: Date, default: Date.now },
  call_end: { type: Date },
  call_duration: { type: Number }, // in seconds
  call_status: { type: String, enum: ['completed', 'missed', 'declined'], default: 'completed' },
  call_recording_url: { type: String } // optional
});

module.exports = mongoose.model('calls', CallSchema);
