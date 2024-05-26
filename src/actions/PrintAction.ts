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

export default class PrintAction extends BaseAction implements Action {
  private message: string;

  constructor() {
    super();
    this.message = "";
  }

  /*initialize(params: { message: string }): void {
    super.initialize(params);
    logger.info(`PrintAction.initialize(${params.message})`);
    this.message = params.message;
  }*/

  async perform(state: any): Promise<string> {
    logger.info('PrintAction.execute()');
    logger.info('Message:', state.message);
    return "completed";
  }

  describe(): string {
    return `Prints a message: ${this.message}`;
  }

  getType(): string {
    return "PrintAction";
  }
}
