const mongoose = require('mongoose');
const shortId = require('shortid');

const decisionSchema = new mongoose.Schema({
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
  email: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  first: {
    type: String,
    required: true
  },
  second: {
    type: String,
    required: true
  },
  third: {
    type: String,
    required: true
  },
  fourth: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Decisions', decisionSchema);