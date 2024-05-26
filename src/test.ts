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
import { WorkflowState } from "./WorkflowState";
const state: any = new WorkflowState();

// Dynamically adding and modifying properties
state.counter = 1;
state.counter += 1;

state.print = { name: "Example Print" };
state.print.name = "Updated Print Name";

// Accessing properties
logger.info(state.counter); // Outputs: 2
logger.info(state.print.name); // Outputs: "Updated Print Name"

// Using defined methods
state.printState(); // Outputs the current state