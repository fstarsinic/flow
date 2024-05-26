import { Action } from "../IAction";
import { BaseAction } from "./BaseAction";

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

export default class SleepAction extends BaseAction implements Action{
    private duration: number;

    constructor() {
      super();
      this.duration = 1;
    }
  
    initialize(params: { duration: number }): void {
      logger.info(`SleepAction.initialize(${params.duration})`);
      this.duration = params.duration;
    }
  
    async perform(state: any): Promise<string> {
      logger.info(state);
      logger.info(`SleepAction.execute(${state})`)
      logger.info(`Sleeping for ${this.duration} second(s).`);
      await new Promise(resolve => setTimeout(resolve, this.duration * 1000));
      state.lastSleepDuration = this.duration;
      return "completed";
    }
  
    describe(): string {
      return `Sleeps for ${this.duration} second(s)`;
    }

    getType(): string {
        return "SleepAction";
    }
  }
  
