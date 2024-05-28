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

  class SharedState {
    public counter: number = 0;
    public previousStates: any[] = [];
    public lastSleepDuration: number = 0;
  
    saveState(): void {
      this.previousStates.push({ counter: this.counter, lastSleepDuration: this.lastSleepDuration });
    }
  
    rollback(): void {
      if (this.previousStates.length > 0) {
        const lastState = this.previousStates.pop();
        this.counter = lastState.counter;
        this.lastSleepDuration = lastState.lastSleepDuration;
      } else {
        logger.debug("No previous state to rollback to.");
      }
    }
  }
  