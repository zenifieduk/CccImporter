
const sgMail = require('@sendgrid/mail');

const express = require('express');
const router = express.Router();

router.post('/', async (request, response) => {
  if (request.httpMethod !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  let data;
  try {
    data = JSON.parse(request.body);
  } catch (error) {
    return response.status(400).json({ error: 'Invalid request body' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send({
      to: 'enquiries@classiccarclubs.uk',
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: 'New Contact Form Submission',
      text: `
Name: ${data.name}
Email: ${data.email}
Message: ${data.message}
      `
    });

    return response.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return response.status(500).json({ error: 'Failed to send email' });
  }
};


module.exports = router;
