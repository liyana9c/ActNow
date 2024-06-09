// backend/models/Incident.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Incident schema
const IncidentSchema = new Schema({
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
  fileUrl: {
    type: String
  },
  reportedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Incident model
const Incident = mongoose.model('Incident', IncidentSchema);

module.exports = Incident;
