const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: Date.now(),
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  goals: {
    type: Array,
    default: []
  },
  avatar: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);