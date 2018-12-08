const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: Number,
    default: Date.now(),
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  goals: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('user', userSchema);