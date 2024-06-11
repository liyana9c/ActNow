const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Incident = require('./models/Incident');
const UserLocation = require('./models/UserLocation');
const axios = require('axios');

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

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const newUser = new User({
      username,
      password: hashedPassword,
      token
    });

    await newUser.save();
    res.status(201).send({ message: 'User registered successfully!', token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error registering user', error });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: 'Login failed', error });
  }
});

// Protected route example
app.get('/admin', authenticateToken, (req, res) => {
  res.send('This is an admin protected route');
});

// Incident routes
app.post('/report-incident', async (req, res) => {
  const { incidentType, incident, details, latitude, longitude, address } = req.body;

  if (!incidentType || !incident || !details || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newIncident = new Incident({
      incidentType,
      incident,
      details,
      latitude,
      longitude,
      address
    });
    await newIncident.save();
    res.status(201).json({ message: 'Incident reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reporting incident', error });
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
