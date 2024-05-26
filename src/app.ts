import { startServer } from './server/index';
import { startScheduler } from './scheduler/index';


// Start the web server
console.log('starting server');
startServer();

// Start the scheduler
console.log('starting scheduler')
startScheduler();
