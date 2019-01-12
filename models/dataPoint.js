const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataPointSchema = new Schema({
  setDate: {
    type: String
  },
  value: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('DataPoint', dataPointSchema)