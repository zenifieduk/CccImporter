const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const sendEmailHandler = require('./src/api/send-email').handler;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('_site'));

app.post('/api/send-email', sendEmailHandler);

function startEleventy() {
  const eleventy = exec('npx @11ty/eleventy --serve --port 5001');

  eleventy.stdout.on('data', (data) => {
    console.log(`[eleventy] ${data}`);
  });

  eleventy.stderr.on('data', (data) => {
    console.error(`[eleventy error] ${data}`);
  });

}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  startEleventy();
});