
const sgMail = require('@sendgrid/mail');

exports.handler = async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Log the request body for debugging
  console.log('Request body:', request.body);
  
  const { name, email, message, 'contact-reason': contactReason } = request.body;

  if (!name || !email || !message) {
    return response.status(400).json({ 
      error: 'Missing required fields',
      received: request.body
    });
  }

  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY environment variable is not set');
    return response.status(500).json({ 
      error: 'Email configuration error' 
    });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Get the verified sender from environment or use a fallback with the form submitter's email
  const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'noreply@classiccarclubs.uk';
  
  try {
    const msg = {
      to: 'enquiries@classiccarclubs.uk', // Change this to your actual email
      from: verifiedSender,
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

    return response.status(200).json({ 
      success: true,
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid Error Response:', error.response.body);
    }
    return response.status(500).json({ 
      error: 'Failed to send email',
      details: error.message
    });
  }
};
