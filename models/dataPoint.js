const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataPointSchema = new Schema({
  setDate: {
    type: Number,
    default: Date.now()
  },
  value: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('DataPoint', dataPointSchema)