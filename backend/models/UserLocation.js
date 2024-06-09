const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserLocation = mongoose.model('UserLocation', userLocationSchema, "userlocations");

module.exports = UserLocation;
