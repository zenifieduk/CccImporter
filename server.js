const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Initialize Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true
}));

// Serve static files from the _site directory
app.use(express.static('_site'));

// CMS API endpoints
// API Routes for Decap CMS
const clubsDir = path.join(__dirname, 'src', '_data', 'clubs-json');
const eventsDir = path.join(__dirname, 'src', '_data', 'events-json');
const uploadsDir = path.join(__dirname, 'public', 'assets', 'images', 'uploads');

// Ensure directories exist
[clubsDir, eventsDir, uploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Get collections
app.get('/api/collections/:collection', (req, res) => {
  const { collection } = req.params;
  let dir;
  
  if (collection === 'clubs') {
    dir = clubsDir;
  } else if (collection === 'events') {
    dir = eventsDir;
  } else {
    return res.status(404).json({ error: 'Collection not found' });
  }
  
  try {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.json'));
    const items = files.map(file => {
      const data = fs.readFileSync(path.join(dir, file), 'utf8');
      return JSON.parse(data);
    });
    
    res.json(items);
  } catch (error) {
    console.error(`Error reading collection ${collection}:`, error);
    res.status(500).json({ error: 'Failed to read collection' });
  }
});

// Get a single entry
app.get('/api/collections/:collection/:slug', (req, res) => {
  const { collection, slug } = req.params;
  let dir;
  
  if (collection === 'clubs') {
    dir = clubsDir;
  } else if (collection === 'events') {
    dir = eventsDir;
  } else {
    return res.status(404).json({ error: 'Collection not found' });
  }
  
  try {
    const filePath = path.join(dir, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(`Error reading entry ${slug}:`, error);
    res.status(500).json({ error: 'Failed to read entry' });
  }
});

// Create or update an entry
app.post('/api/collections/:collection', (req, res) => {
  const { collection } = req.params;
  const data = req.body;
  let dir;
  
  if (collection === 'clubs') {
    dir = clubsDir;
    
    // Add an ID if not present
    if (!data.id) {
      // Read all club files to find highest ID
      const files = fs.readdirSync(dir).filter(file => file.endsWith('.json'));
      let maxId = 899; // Start from where the existing clubs end
      
      files.forEach(file => {
        try {
          const clubData = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
          if (clubData.id && clubData.id > maxId) {
            maxId = clubData.id;
          }
        } catch (err) {
          console.error(`Error reading file ${file}:`, err);
        }
      });
      
      data.id = maxId + 1;
    }
  } else if (collection === 'events') {
    dir = eventsDir;
  } else {
    return res.status(404).json({ error: 'Collection not found' });
  }
  
  try {
    if (!data.slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }
    
    const filePath = path.join(dir, `${data.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    // Rebuild the site
    exec('npx @11ty/eleventy', (error) => {
      if (error) {
        console.error('Error rebuilding site:', error);
      }
    });
    
    res.status(201).json({ message: 'Entry created/updated successfully', data });
  } catch (error) {
    console.error(`Error saving entry to ${collection}:`, error);
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

// Handle file uploads
app.post('/api/upload', (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Files:', req.files);
    
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
      // If this is a URL validation only (no actual file)
      if (req.body && req.body.url) {
        console.log('URL validation request for:', req.body.url);
        return res.json({ url: req.body.url });
      }
      return res.status(400).json({ error: 'No files were uploaded' });
    }
    
    const uploadedFile = req.files.file;
    
    // Clean the filename to be URL-friendly
    const cleanFilename = uploadedFile.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-');
    
    const uploadPath = path.join(uploadsDir, cleanFilename);
    
    console.log('Moving uploaded file to:', uploadPath);
    
    // Move the file
    uploadedFile.mv(uploadPath, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ error: 'Failed to upload file', details: err.message });
      }
      
      // Return the URL for the uploaded file
      const fileUrl = `/assets/images/uploads/${cleanFilename}`;
      console.log('File uploaded successfully to:', fileUrl);
      res.json({ url: fileUrl });
    });
  } catch (error) {
    console.error('Error in file upload:', error);
    res.status(500).json({ 
      error: 'Failed to process file upload', 
      details: error.message,
      stack: error.stack
    });
  }
});

// Start eleventy in the background
function startEleventy() {
  const eleventy = exec('npx @11ty/eleventy --serve --port 5001');
  
  eleventy.stdout.on('data', (data) => {
    console.log(`[eleventy] ${data}`);
  });
  
  eleventy.stderr.on('data', (data) => {
    console.error(`[eleventy error] ${data}`);
  });
  
  eleventy.on('close', (code) => {
    console.log(`Eleventy process exited with code ${code}`);
  });
}

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startEleventy();
});