"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LogAction {
    initialize(params) {
        this.logMessage = params.logMessage;
    }
    async execute(state) {
        console.log(`LOG: ${this.logMessage}`);
        return "completed";
    }
    describe() {
        return `Logs a message to the console: ${this.logMessage}`;
    }
}
