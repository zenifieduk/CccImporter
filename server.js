require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

const app = express();

// Add CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('_site'));

// SendGrid API endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request body:', req.body);
    
    const { name, email, message, contactReason } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: req.body
      });
    }

    // Check for SendGrid API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Email configuration error' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Get the sender and recipient from environment variables
    const fromEmail = process.env.FROM_EMAIL_ADDRESS || 'noreply@classiccarclubs.uk';
    
    const msg = {
      to: process.env.TO_EMAIL_ADDRESS || 'enquiries@classiccarclubs.uk', // Get recipient from env
      from: { email: fromEmail, name: "Classic Car Clubs Contact Form" }, // Format as per SendGrid docs
      replyTo: email,
      subject: `Contact Form: ${contactReason || 'General Inquiry'}`,
      text: `
Name: ${name}
Email: ${email}
Reason: ${contactReason || 'Not specified'}

Message:
${message}
      `,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reason:</strong> ${contactReason || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    console.log('Sending email with SendGrid...');
    await sgMail.send(msg);
    console.log('Email sent successfully');

    return res.status(200).json({ 
      success: true,
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid Error Response:', error.response.body);
    }
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});