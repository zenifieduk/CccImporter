const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const firstName = body.first_name || body.firstName;
  const lastName = body.last_name || body.lastName;
  const email = body.email;

  if (!email || !firstName) {
    return res.status(400).json({ error: 'Missing required fields (first_name, email)' });
  }

  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Email configuration error' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'noreply@classiccarclubs.uk';

  try {
    await sgMail.send({
      to: email,
      from: verifiedSender,
      subject: 'Welcome to Classic Car Clubs Newsletter',
      text: `Hi ${firstName},\n\nThank you for subscribing to our newsletter. You'll now receive updates about classic car events and news.\n\nBest regards,\nClassic Car Clubs Team`,
    });

    await sgMail.send({
      to: 'enquiries@classiccarclubs.uk',
      from: verifiedSender,
      subject: 'New newsletter subscriber',
      text: `New newsletter signup:\n\nName: ${firstName} ${lastName || ''}\nEmail: ${email}`,
    });

    return res.status(200).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    if (error.response) {
      console.error('SendGrid Error Response:', error.response.body);
    }
    return res.status(500).json({
      error: 'Failed to process subscription',
      details: error.message,
    });
  }
};
