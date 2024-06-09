const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-help-email', (req, res) => {
  const { latitude, longitude } = req.body;

  const mailOptions = {
    from: 'anonymous@actnow.com',
    to: 'xxx@gmail.com',
    subject: 'Emergency Help Needed',
    text: `A bystander has reported an emergency. Location: Latitude ${latitude}, Longitude ${longitude}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send({ message: 'Error sending email', error });
    } else {
      console.log('Email sent:', info.response);
      return res.status(200).send({ message: 'Help email sent successfully!' });
    }
  });
});

app.post('/report-incident', upload.single('file'), (req, res) => {
  console.log('Request received at /report-incident');
  const { incident, details } = req.body;
  const file = req.file;

  let mailOptions = {
    from: 'anonymous@actnow.com',
    to: 'dheshini554@gmail.com',
    subject: `Incident Report: ${incident}`,
    text: `Details: ${details}`
  };

  if (file) {
    mailOptions.attachments = [
      {
        filename: file.originalname,
        path: file.path
      }
    ];
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send({ message: 'Error sending report', error });
    } else {
      console.log('Report sent:', info.response);

      // Clean up uploaded file
      if (file) {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Failed to delete file:', file.path);
          }
        });
      }

      return res.status(200).send({ message: 'Report sent successfully!' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});