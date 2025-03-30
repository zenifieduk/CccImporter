// This is the server.js file for the Classic Car Clubs website
// It uses Express.js to serve the static site built by 11ty
// and handle API requests

const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();
const PORT = process.env.PORT || 5000;

// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// For file uploads
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
}));

// Enable CORS
const cors = require('cors');
app.use(cors());

// Serve static files from _site directory (the 11ty output)
app.use(express.static(path.join(__dirname, '_site')));

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Here you would normally add the email to a database or newsletter service
    // For development, we'll just log it
    console.log(`Subscription request for email: ${email}`);
    
    // If we have SendGrid configured, send a confirmation email
    if (process.env.SENDGRID_API_KEY) {
      try {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
          to: email,
          from: 'info@classiccars.club', // Verified sender in SendGrid
          subject: 'Welcome to Classic Car Clubs Newsletter',
          text: 'Thank you for subscribing to our newsletter. You will now receive updates on classic car events, news, and more.',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0f4c3a;">Welcome to Classic Car Clubs!</h1>
              <p>Thank you for subscribing to our newsletter. You will now receive updates on:</p>
              <ul>
                <li>Classic car events and rallies</li>
                <li>News from car clubs around the country</li>
                <li>Restoration tips and advice</li>
                <li>Special offers from our partners</li>
              </ul>
              <p>We're excited to have you join our community!</p>
              <p><a href="https://classiccars.club" style="color: #1a7f62;">Visit our website</a></p>
            </div>
          `,
        };
        
        await sgMail.send(msg);
        console.log('Confirmation email sent');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Continue with the response even if email fails
      }
    }
    
    // Send a success response
    res.json({ success: true, message: 'Subscription successful!' });
  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact form endpoint
app.post('/api/contact', require('./src/api/contact'));

// Event submission endpoint
app.post('/api/submit-event', async (req, res) => {
  try {
    const { title, description, date, endDate, location, organizerName, organizerEmail, categories } = req.body;
    
    if (!title || !description || !date || !location || !organizerName || !organizerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Handle image upload if present
    let eventImage = null;
    if (req.files && req.files.eventImage) {
      const imageFile = req.files.eventImage;
      const uploadPath = path.join(__dirname, 'public', 'uploads', imageFile.name);
      
      try {
        await imageFile.mv(uploadPath);
        eventImage = `/uploads/${imageFile.name}`;
        console.log(`Image uploaded to ${uploadPath}`);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Continue without the image
      }
    }
    
    // Log the event submission for development
    console.log(`Event submission: ${title}`);
    console.log(`Date: ${date} ${endDate ? `- ${endDate}` : ''}`);
    console.log(`Location: ${JSON.stringify(location)}`);
    console.log(`Organizer: ${organizerName} (${organizerEmail})`);
    if (eventImage) {
      console.log(`Image: ${eventImage}`);
    }
    
    // In a real application, you would save this to a database
    // For now, we'll just return a success response
    
    // Send a success response
    res.json({ success: true, message: 'Event submitted successfully! It will be reviewed by our team.' });
  } catch (error) {
    console.error('Error processing event submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoints for clubs and events data
// These are served statically by 11ty, but we can add them here for reference
app.get('/api/clubs', (req, res) => {
  res.sendFile(path.join(__dirname, '_site', 'clubs.json'));
});

app.get('/api/events', (req, res) => {
  res.sendFile(path.join(__dirname, '_site', 'events.json'));
});

// Catch-all route - serve the 11ty site
// This allows for client-side routing with history API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '_site', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});