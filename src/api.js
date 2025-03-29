const express = require('express');
const bodyParser = require('body-parser');
const subscribeHandler = require('./api/subscribe');

const router = express.Router();

// Parse JSON request body
router.use(bodyParser.json());

// Route for subscribe endpoint
router.post('/subscribe', async (req, res) => {
  await subscribeHandler(req, res);
});

module.exports = router;