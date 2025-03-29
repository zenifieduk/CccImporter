const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const sgMail = require('@sendgrid/mail');
const client = require('@sendgrid/client');

// Initialize Express app
const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set SendGrid API key from environment variable
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  client.setApiKey(process.env.SENDGRID_API_KEY);
}

// Serve static files from the _site directory
app.use(express.static('_site'));

// API endpoint for newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(500).json({ 
        error: 'SendGrid API key is not configured. Please contact the administrator.' 
      });
    }

    // Get user data from request body
    const { first_name, last_name, email } = req.body;
    
    if (!email || !first_name || !last_name) {
      return res.status(400).json({ error: 'Missing required fields' });
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
    
    // Send welcome email to the new subscriber
    const msg = {
      to: email,
      from: 'noreply@classiccarclubs.co.uk', // Replace with your verified email address
      subject: 'Welcome to Classic Car Clubs Newsletter',
      text: `Hi ${first_name},\n\nThank you for subscribing to our newsletter! You'll now receive the latest news, stories, and event information about the classic car community.\n\nBest regards,\nClassic Car Clubs Team`,
      html: `<p>Hi ${first_name},</p><p>Thank you for subscribing to our newsletter! You'll now receive the latest news, stories, and event information about the classic car community.</p><p>Best regards,<br>Classic Car Clubs Team</p>`,
    };
    
    await sgMail.send(msg);
    
    // Return success response
    return res.status(200).json({ success: true, message: 'Subscription successful' });
  } catch (error) {
    console.error('Error handling subscription:', error);
    return res.status(500).json({ error: 'Subscription failed', details: error.message });
  }
});

// Start eleventy in the background
function startEleventy() {
  const eleventy = exec('npx @11ty/eleventy --serve --port 5001');
  
  eleventy.stdout.on('data', (data) => {
    console.log(`[eleventy] ${data}`);
  });
  
  eleventy.stderr.on('data', (data) => {
    console.error(`[eleventy error] ${data}`);
  });
  
  eleventy.on('close', (code) => {
    console.log(`Eleventy process exited with code ${code}`);
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startEleventy();
});