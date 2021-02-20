const mongoose = require('mongoose');
const shortId = require('shortid');

const users = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  availability: {
    sunday: {
      type: [Number]
    },
    monday: {
      type: [Number]
    },
    tuesday: {
      type: [Number]
    },
    wednesday: {
      type: [Number]
    },
    thursday: {
      type: [Number]
    },
    friday: {
      type: [Number]
    },
    saturday: {
      type: [Number]
    }
  },
  matched: {
    type: Boolean,
    required: true,
    default: false
  },
  zoom: {
    type: String,
    default: ""
  },
  partner: {
    name: {
      type: String,
      required: true,
      default: ""
    },
    email: {
      type: String,
      required: true,
      default: ""
    },
    time: {
      day: {
        type: Number,
        required: true,
        default: 0
      },
      hour: {
        type: Number,
        required: true,
        default: 0
      }
    }
  }
});

module.exports = mongoose.model('Users', users);