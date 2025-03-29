const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

// Initialize Express app
const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the _site directory
app.use(express.static('_site'));

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startEleventy();
});