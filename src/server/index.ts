import express from 'express';
import { taskStatus } from '../scheduler/index'; // Import taskStatus from scheduler.js

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
};
