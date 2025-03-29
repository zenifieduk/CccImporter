
const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
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

    return {
      statusCode: 200,
      body: JSON.stringify({message: 'Email sent successfully'})
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({message: 'Error sending email'})
    };
  }
};
