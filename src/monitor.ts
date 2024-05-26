import { EventEmitter } from 'events';

class VisitorMonitor extends EventEmitter {
    private activeVisitors: number = 0;

    constructor() {
        super();
        this.on('newVisitor', this.subscribe);
        this.on('visitorLeft', this.unsubscribe);
        this.on('stateChanged', this.updateState);
    }

    async start() {
            console.log('Processing active visitors.');
            console.log(`Active visitors: ${this.activeVisitors}`);
    }   
 
    private updateState = (p: {}) => {
        console.log('State changed');
        console.log(p)
        this.start()

    }

    subscribe = (p: {}) => {
        this.activeVisitors += 1;
        console.log(`Visitor added. Active visitors: ${this.activeVisitors}`);
        console.log(p)
        // Process visitor immediately or perform some action
        this.start();
    }

    private unsubscribe = () => {
        this.activeVisitors = Math.max(0, this.activeVisitors - 1);
        console.log(`Visitor left. Active visitors: ${this.activeVisitors}`);
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
