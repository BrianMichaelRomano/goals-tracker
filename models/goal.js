const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
  goalName: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  goalTarget: {
    type: Number,
    default: 1
  },
  goalType: {
    type: String,
    default: 'time'
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
  },
  dataSet: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Goal', goalSchema);