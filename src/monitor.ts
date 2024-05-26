import { EventEmitter } from 'events';
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

class VisitorMonitor extends EventEmitter {
    private activeVisitors: number = 0;

    constructor() {
        super();
        this.on('newVisitor', this.subscribe);
        this.on('visitorLeft', this.unsubscribe);
        this.on('stateChanged', this.updateState);
    }

    async start() {
            logger.info('Processing active visitors.');
            logger.info(`Active visitors: ${this.activeVisitors}`);
    }   
 
    private updateState = (p: {}) => {
        logger.info('State changed');
        logger.info(p)
        this.start()

    }

    subscribe = (p: {}) => {
        this.activeVisitors += 1;
        logger.info(`Visitor added. Active visitors: ${this.activeVisitors}`);
        logger.info(p)
        // Process visitor immediately or perform some action
        this.start();
    }

    private unsubscribe = () => {
        this.activeVisitors = Math.max(0, this.activeVisitors - 1);
        logger.info(`Visitor left. Active visitors: ${this.activeVisitors}`);
    }

    public simulateNewVisitor1() {
        this.emit('newVisitor', {name: 'John Doe', age: 30});
    }

    public simulateNewVisitor2() {
        this.emit('newVisitor', {name: 'Jane Doe', age: 24});
    }

    public simulateVisitorLeft() {
        this.emit('visitorLeft');
    }

    public simulateStateChanged() {
        this.emit('stateChanged', {state: 'active'});
    }

    public simulateStateChangeError() {
        this.emit('stateChanged', {error: 'Invalid state'});
    }
}

const monitor = new VisitorMonitor();

// Simulate waiting for visitors
//monitor.start();

// Simulate visitor events
setTimeout(() => monitor.simulateNewVisitor1(), 2000); // New visitor arrives after 2 seconds
setTimeout(() => monitor.simulateNewVisitor2(), 2000); // New visitor arrives after 2 seconds
setTimeout(() => monitor.simulateStateChanged(), 2000); // State changes after 6 seconds
setTimeout(() => monitor.simulateStateChangeError(), 2000); // State changes after 6 seconds
setTimeout(() => monitor.simulateNewVisitor1(), 2000); // Another visitor arrives after 7 seconds
setTimeout(() => monitor.simulateVisitorLeft(), 2000); // Visitor leaves after 8 seconds
setTimeout(() => monitor.simulateVisitorLeft(), 2000); // Visitor leaves after 8 seconds
setTimeout(() => monitor.simulateVisitorLeft(), 2000); // Visitor leaves after 8 seconds
