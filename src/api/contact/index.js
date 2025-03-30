const sgMail = require('@sendgrid/mail');
const site = require('../../_data/site');

// Set SendGrid API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Handle contact form submissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleContactForm(req, res) {
  try {
    const { name, email, club, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and message.'
      });
    }
    
    // Validate email format (simple validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }
    
    // Check if SendGrid API key is available
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key is not set');
      return res.status(500).json({
        success: false,
        message: 'Email service is currently unavailable. Please try again later.'
      });
    }
    
    // Prepare email content
    const emailData = {
      to: site.contact.email,
      from: site.contact.email, // Sender must be verified in SendGrid
      subject: `New contact form submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
${club ? `Club: ${club}` : ''}

Message:
${message}
      `,
      html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
${club ? `<p><strong>Club:</strong> ${club}</p>` : ''}
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Send email
    await sgMail.send(emailData);
    
    // Send confirmation email to the user
    const confirmationEmail = {
      to: email,
      from: site.contact.email,
      subject: 'Thank you for contacting Classic Car Clubs',
      text: `
Dear ${name},

Thank you for contacting Classic Car Clubs. We have received your message and will get back to you as soon as possible.

Your message:
${message}

Best regards,
The Classic Car Clubs Team
      `,
      html: `
<h3>Thank you for contacting Classic Car Clubs</h3>
<p>Dear ${name},</p>
<p>Thank you for contacting Classic Car Clubs. We have received your message and will get back to you as soon as possible.</p>
<p><strong>Your message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
<p>Best regards,<br>The Classic Car Clubs Team</p>
      `
    };
    
    await sgMail.send(confirmationEmail);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: 'There was an error sending your message. Please try again later.'
    });
  }
}

module.exports = handleContactForm;