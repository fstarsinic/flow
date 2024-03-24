"use strict";
class SharedState {
    constructor() {
        this.counter = 0;
        this.previousStates = [];
        this.lastSleepDuration = 0;
    }
    saveState() {
        this.previousStates.push({ counter: this.counter, lastSleepDuration: this.lastSleepDuration });
    }
    rollback() {
        if (this.previousStates.length > 0) {
            const lastState = this.previousStates.pop();
            this.counter = lastState.counter;
            this.lastSleepDuration = lastState.lastSleepDuration;
        }
        else {
            console.log("No previous state to rollback to.");
        }
    }
}
