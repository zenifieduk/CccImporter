const express = require('express');
const bodyParser = require('body-parser');
const subscribeHandler = require('./api/subscribe');
const sendEmailHandler = require('./api/send-email');

const router = express.Router();

// Parse JSON request body
router.use(bodyParser.json());

// Route for subscribe endpoint
router.post('/subscribe', async (req, res) => {
  await subscribeHandler(req, res);
});

// Route for send-email endpoint (handles the contact form)
router.post('/send-email', async (req, res) => {
  await sendEmailHandler(req, res);
});

module.exports = router;