
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

router.post('/', async (request, response) => {
  try {
    const { firstName, lastName, email } = request.body;

    // Add your newsletter subscription logic here
    // This could be adding to a database, SendGrid list, etc.
    
    // Send confirmation email
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: 'Welcome to Classic Car Clubs Newsletter',
      text: `Hi ${firstName},\n\nThank you for subscribing to our newsletter. You'll now receive updates about classic car events and news.\n\nBest regards,\nClassic Car Clubs Team`
    });

    return response.status(200).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return response.status(500).json({ error: 'Failed to process subscription' });
  }
});

module.exports = router;
