
const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send({
      to: process.env.SENDGRID_VERIFIED_SENDER,
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Email sent successfully' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};
