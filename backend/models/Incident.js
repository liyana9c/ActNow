const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incident: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  filePath: {
    type: String
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
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Incident = mongoose.model('Incident', incidentSchema, "incidents");

module.exports = Incident;
