const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set the SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Handler for the contact form email
async function sendEmailHandler(req, res) {
  try {
    // Get form data from request
    const { name, email, contactReason, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide name, email, and message.' 
      });
    }

    // Create email message with environment variables
    const msg = {
      to: process.env.TO_EMAIL_ADDRESS || 'enquiries@classiccarclubs.uk',
      from: { 
        email: process.env.FROM_EMAIL_ADDRESS || 'noreply@classiccarclubs.uk', 
        name: "Classic Car Clubs Contact Form" 
      },
      replyTo: email,
      subject: `Classic Car Clubs Contact: ${contactReason || 'General Inquiry'}`,
      text: `Name: ${name}\nEmail: ${email}\nReason: ${contactReason || 'Not specified'}\nMessage: ${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reason:</strong> ${contactReason || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    await sgMail.send(msg);

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully.' 
    });
  } catch (error) {
    console.error('SendGrid Error:', error);
    
    // Return error response
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send email. Please try again later.'
    });
  }
}

module.exports = sendEmailHandler;