const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('./models/User');
const Incident = require('./models/Incident');
const UserLocation = require('./models/UserLocation');
const fs = require('fs');

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
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(403);

  try {
    const user = await User.findOne({ token });
    if (!user) return res.sendStatus(403);
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ message: 'Authentication error', error });
  }
};

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with a token
    const newUser = new User({
      username,
      password: hashedPassword,
      token: crypto.randomBytes(64).toString('hex')
    });

    await newUser.save();
    res.status(201).send({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error registering user', error });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send({ message: 'Invalid credentials' });

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

    res.json({ token: user.token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: 'Login failed', error });
  }
});

// Protected route example
app.get('/admin', authenticateToken, (req, res) => {
  res.send('This is an admin protected route');
});

// Incident routes (as before)
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
