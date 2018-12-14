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
  goals: {
    type: Array,
    default: ['Programming', 'Family', 'Excercise', 'Relaxing']
  }
});

module.exports = mongoose.model('User', userSchema);