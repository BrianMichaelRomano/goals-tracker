const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: Number,
    default: Date.now(),
    required: true
  }
});

module.exports = mongoose.model('goal', goalSchema);