// actions.ts
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

interface IAction {
    performAction(): void;
  }
  
  class ActionOne implements IAction {
    performAction() {
      logger.info("ActionOne is running");
      // Additional logic
    }
  }
  
  class ActionTwo implements IAction {
    performAction() {
      logger.info("ActionTwo is running");
      // Additional logic
    }
  }
  
  export { IAction, ActionOne, ActionTwo };
  