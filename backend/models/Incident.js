const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentType: {
    type: String,
    required: true,
    enum: ['Fire', 'Crime', 'Medical', 'Other']
  },
  incident: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Incident', incidentSchema, 'incidents');
