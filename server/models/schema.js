const mongoose = require('mongoose');
const shortId = require('shortid');

const users = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
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
    default: false
  },
  zoom: {
    type: String,
    default: ""
  },
  partner: {
    name: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    time: {
      day: {
        type: Number,
        default: 0
      },
      hour: {
        type: Number,
        default: 0
      }
    }
  }
});

module.exports = mongoose.model('Users', users);