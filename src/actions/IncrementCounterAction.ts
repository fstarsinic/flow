import { WorkflowState } from '../WorkflowState'; // Import the WorkflowState type
import { Action } from '../IAction'; // Import the Action interface
import { BaseAction } from './BaseAction'; // Import the BaseAction class



// Create a logger instance
import pino from 'pino';
const log = pino({ transport: { target: "pino-pretty", }, });
import path from 'path';

// Use path.extname to get the extension of the current file
const fileExtension = path.extname(__filename);
// Use path.basename with the dynamic extension to get the filename without the extension
const fileNameWithoutExtension = path.basename(__filename, fileExtension);


const logger = log.child({
    name: fileNameWithoutExtension,
  });

class IncrementCounterAction extends BaseAction implements Action {
    initialize(params: any): void {
        // Initialization logic here
    }   

   // Adjusting the WorkflowState type to an any type
    async perform(state: any): Promise<string> {
    state.counter = 0;
    state.counter += 1;
    state.message = `Counter incremented to ${state.counter}.`;
    return "completed";
}

    describe(): string {
        return "Increments the counter and updates the message.";
    }

    getType(): string {
        return "IncrementCounterAction";
    }
}
