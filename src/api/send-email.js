
const sgMail = require('@sendgrid/mail');

exports.handler = async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, 'contact-reason': contactReason } = request.body;

  if (!name || !email || !message) {
    return response.status(400).json({ 
      error: 'Missing required fields' 
    });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send({
      to: 'enquiries@classiccarclubs.uk',
      from: process.env.SENDGRID_VERIFIED_SENDER,
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
    });

    return response.status(200).json({ 
      success: true,
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return response.status(500).json({ 
      error: 'Failed to send email' 
    });
  }
};
