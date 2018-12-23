const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
  goalName: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: Number,
    default: Date.now(),
    required: true
  },
  chartType: {
    type: String,
    default: 'line'
  },
  daysToTrack: {
    type: Number,
    default: 30
  },
  borderColor: {
    type: String,
    default: '#808877'
  },
  backgroundColor: {
    type: String,
    default: '#a6aca0'
  }
});

module.exports = mongoose.model('Goal', goalSchema);