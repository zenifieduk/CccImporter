const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set the SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Handler for the contact form email
async function sendEmailHandler(req, res) {
  try {
    // Get form data from request
    const { name, email, club, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide name, email, and message.' 
      });
    }

    // Create email message
    const msg = {
      to: 'contact@classiccars.club', // Replace with your preferred recipient email
      from: 'noreply@classiccars.club', // Replace with your verified sender email
      replyTo: email,
      subject: `Classic Car Clubs Contact: ${club ? `Regarding ${club}` : 'General Inquiry'}`,
      text: `Name: ${name}\nEmail: ${email}\n${club ? `Club: ${club}\n` : ''}Message: ${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${club ? `<p><strong>Club:</strong> ${club}</p>` : ''}
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