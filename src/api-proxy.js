/**
 * API Proxy for local development
 * 
 * This allows us to test Netlify functions locally when developing with 11ty.
 * It loads the Netlify function and provides an Express middleware to handle the request.
 */

const sendEmailFunction = require('../netlify/functions/send-email');

// Express middleware that simulates a Netlify function call
const sendEmailHandler = async (req, res) => {
  try {
    // Build an event object that matches what Netlify would send
    const event = {
      httpMethod: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
      queryStringParameters: req.query
    };

    // Call the function with our simulated event
    const response = await sendEmailFunction.handler(event);
    
    // Set status code and headers
    res.status(response.statusCode);
    
    // Parse and send the response body
    const responseBody = JSON.parse(response.body);
    res.json(responseBody);
  } catch (error) {
    console.error('Error in API proxy:', error);
    res.status(500).json({
      error: 'Internal server error in API proxy',
      details: error.message
    });
  }
};

module.exports = {
  sendEmailHandler
};