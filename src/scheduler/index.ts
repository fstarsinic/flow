// scheduler.js
const schedule = require('node-schedule');
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

// Task status tracking object
export const taskStatus = {
  Task1: { status: 'sleeping', count: 0 },
  Task2: { status: 'sleeping', count: 0 }
};

const updateTaskStatus = (taskName: string, status: string) => {
    (taskStatus as { [key: string]: { status: string; count: number } })[taskName].status = status;
    if (status === 'running') {
        (taskStatus as { [key: string]: { status: string; count: number } })[taskName].count += 1;
    }
};

export const startScheduler = () => {
// Schedule Task 1
schedule.scheduleJob('*/10 * * * * *', () => {
    updateTaskStatus('Task1', 'running');
    logger.info('Task1 is running');
    // Simulate task work with a timeout
    setTimeout(() => updateTaskStatus('Task1', 'sleeping'), 5000);
});

// Schedule Task 2
schedule.scheduleJob('*/15 * * * * *', () => {
  updateTaskStatus('Task2', 'running');
  logger.info('Task2 is running');
  // Simulate task work with a timeout
  setTimeout(() => updateTaskStatus('Task2', 'sleeping'), 7000);
});
}
