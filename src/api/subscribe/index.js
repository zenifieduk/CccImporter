// Require the SendGrid mail module
const sgMail = require('@sendgrid/mail');
const client = require('@sendgrid/client');

// Create a development mode flag to skip actual API calls during development
const DEVELOPMENT_MODE = true; // Set to false in production

// Check if we have the API key
const hasApiKey = !!process.env.SENDGRID_API_KEY;

// If API key exists, set it
if (hasApiKey) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  client.setApiKey(process.env.SENDGRID_API_KEY);
}

// Main export function that gets executed when this endpoint is called
module.exports = async (req, res) => {
  // Check for POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, please use POST' });
  }

  try {
    // Get user data from request body
    const { first_name, last_name, email } = req.body;
    
    if (!email || !first_name || !last_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In development mode, skip actual SendGrid API calls
    if (DEVELOPMENT_MODE) {
      console.log('DEVELOPMENT MODE: Simulating successful subscription');
      console.log(`Would have subscribed: ${first_name} ${last_name} (${email})`);
      
      // Return success response
      return res.status(200).json({ 
        success: true, 
        message: 'Subscription successful (Development Mode)',
        note: 'This is a simulated success. In production mode, the actual SendGrid API would be called.'
      });
    }

    // Check if we have the API key
    if (!hasApiKey) {
      console.error('SendGrid API key is missing');
      return res.status(500).json({ 
        error: 'Configuration error', 
        details: 'SendGrid API key is not configured.'
      });
    }

    // Add contact to SendGrid contact list
    const data = {
      contacts: [
        {
          email: email,
          first_name: first_name,
          last_name: last_name,
        }
      ]
    };

    const request = {
      url: '/v3/marketing/contacts',
      method: 'PUT',
      body: data
    };

    // Send the request to add the contact to SendGrid
    await client.request(request);
    
    // Return success response
    return res.status(200).json({ success: true, message: 'Subscription successful' });
  } catch (error) {
    console.error('Error handling subscription:', error);
    
    // Provide a more user-friendly error message
    let errorMessage = 'Subscription failed. Please try again later.';
    let errorDetails = error.message;
    
    // If it's a SendGrid API error with specific error information
    if (error.response && error.response.body && error.response.body.errors) {
      errorDetails = JSON.stringify(error.response.body.errors);
    }
    
    return res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails,
      note: 'Please ensure your SendGrid account is properly set up with a verified sender and correct API permissions.'
    });
  }
};