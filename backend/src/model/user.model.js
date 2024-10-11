const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  full_name: { type: String },
  avatar_url: { type: String },
  background_url: { type: String },
  bio: { type: String },
  behavior: { type: Number, default: 0 },
  gender: { type: String },
  age: { type: Number },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created_at: { type: Date, default: Date.now },
  last_online: { type: Date },
  is_online: { type: Boolean, default: false },
  blocked_users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  preferences: {
    notifications_enabled: { type: Boolean, default: true },
    show_location_based_suggestions: { type: Boolean, default: true }
  },
  refreshToken: { type: String },
  refreshTokenExpires: { type: Date }
});


User.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});



module.exports = mongoose.model('users', User);
