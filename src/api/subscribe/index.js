// Require the SendGrid mail module
const sgMail = require('@sendgrid/mail');
const client = require('@sendgrid/client');

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
client.setApiKey(process.env.SENDGRID_API_KEY);

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
};