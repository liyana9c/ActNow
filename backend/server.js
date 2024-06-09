const express = require('express');
const bodyParser = require('body-parser');
const Incident = require('./models/Incident');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const axios = require('axios');
const UserLocation = require('./models/UserLocation');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'ActNow'
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

// Helper function to get address from latitude and longitude using OpenCage Geocoding API
const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`);
    if (response.data.results.length > 0) {
      return response.data.results[0].formatted;
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return '';
  }
};

app.post('/report-incident', async (req, res) => {
  console.log('Request received at /report-incident');
  const { incident, details, fileContent, latitude, longitude, address } = req.body;

  const resolvedAddress = address || await getAddressFromCoordinates(latitude, longitude);

  const filePath = `uploads/${Date.now()}-incident.txt`;
  if (fileContent) {
    fs.writeFileSync(filePath, fileContent);
  }

  const newIncident = new Incident({
    incident,
    details,
    filePath: fileContent ? filePath : null,
    latitude,
    longitude,
    address: resolvedAddress
  });

  try {
    await newIncident.save();
    res.status(200).send({ message: 'Report sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error sending report', error });
  }
});

app.post('/send-help-location', async (req, res) => {
  const { latitude, longitude, address } = req.body;

  const resolvedAddress = address || await getAddressFromCoordinates(latitude, longitude);

  const newUserLocation = new UserLocation({
    latitude,
    longitude,
    address: resolvedAddress
  });

  try {
    await newUserLocation.save();
    res.status(200).send({ message: 'Location saved successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error saving location', error });
  }
});

app.get('/incidents', async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.status(200).json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).send({ message: 'Error fetching incidents', error });
  }
});

app.get('/user-locations', async (req, res) => {
  try {
    const userLocations = await UserLocation.find();
    res.status(200).json(userLocations);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).send({ message: 'Error fetching user locations', error });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
