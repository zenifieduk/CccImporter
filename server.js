
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const sgMail = require('@sendgrid/mail');

// Initialize Express app
const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the _site directory
app.use(express.static('_site'));

// API endpoint for contact form submissions
app.post('/contact', async (req, res) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key not found');
    return res.status(500).json({
      success: false,
      message: 'Email configuration error'
    });
  }

  const { name, email, message, 'contact-reason': contactReason } = req.body;

  // Validate form data
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // Configure SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send({
      to: 'enquiries@classiccarclubs.uk',
      from: process.env.SENDGRID_VERIFIED_SENDER || 'noreply@classiccarclubs.uk',
      subject: `Contact Form: ${contactReason || 'General Inquiry'}`,
      text: `
Name: ${name}
Email: ${email}
Reason: ${contactReason || 'Not specified'}
Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reason:</strong> ${contactReason || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('SendGrid Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
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
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  startEleventy();
});
