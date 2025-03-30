const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const sgMail = require('@sendgrid/mail');

// Initialize Express app
const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure SendGrid
// Always set the API key - we know it exists from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Serve static files from the _site directory
app.use(express.static('_site'));

// API endpoint for contact form submissions
app.post('/api/send-email', async (req, res) => {
  console.log('Received contact form submission:', req.body);
  
  const { name, email, message, 'contact-reason': contactReason } = req.body;
  
  // Validate form fields
  if (!name || !email || !message) {
    console.log('Missing required fields');
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide all required fields: name, email, and message' 
    });
  }
  
  try {
    // Create message for SendGrid
    const msg = {
      to: 'enquiries@classiccarclubs.uk',
      from: 'noreply@classiccarclubs.uk',
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
    
    console.log('Sending email via SendGrid');
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
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
  
  eleventy.on('close', (code) => {
    console.log(`Eleventy process exited with code ${code}`);
  });
}

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startEleventy();
});