const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, 'contact-reason': contactReason } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      received: req.body,
    });
  }

  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Email configuration error' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'noreply@classiccarclubs.uk';

  try {
    await sgMail.send({
      to: 'enquiries@classiccarclubs.uk',
      from: verifiedSender,
      replyTo: email,
      subject: `Contact Form: ${contactReason || 'General Inquiry'}`,
      text: `Name: ${name}\nEmail: ${email}\nReason: ${contactReason || 'Not specified'}\n\nMessage:\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reason:</strong> ${contactReason || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid Error Response:', error.response.body);
    }
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
};
