import express from 'express';
import { taskStatus } from '../scheduler/index'; // Import taskStatus from scheduler.js
import path from 'path';
import { P } from 'pino';
// Create a logger instance
import pino from 'pino';
const log = pino({ transport: { target: "pino-pretty", }, });
// Use path.extname to get the extension of the current file
const fileExtension = path.extname(__filename);
// Use path.basename with the dynamic extension to get the filename without the extension
const fileNameWithoutExtension = path.basename(__filename, fileExtension);
const logger = log.child({
    name: fileNameWithoutExtension,
  });

// Import the scheduler to ensure tasks are scheduled
//require('./scheduler');
//const taskStatus = require('./scheduler'); // Import taskStatus from scheduler.js

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Add a route for '/'
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/status', (req, res) => {
  res.json(taskStatus);
});


export const startServer = () => {
  app.listen(PORT, () => {
    logger.debug(`Server running on http://localhost:${PORT}`);
  });
};
