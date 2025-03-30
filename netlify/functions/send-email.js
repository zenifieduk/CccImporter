const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse the request body
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
    console.log('Request body:', requestBody);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  // Extract form data
  const { name, email, message, 'contact-reason': contactReason } = requestBody;

  // Validate required fields
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Missing required fields',
        received: requestBody
      })
    };
  }

  // Check for SendGrid API key
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email configuration error' })
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Get the verified sender from environment or use a fallback
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

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Email sent successfully' 
      })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid Error Response:', error.response.body);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message
      })
    };
  }
};