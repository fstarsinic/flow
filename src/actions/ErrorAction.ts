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

export default class ErrorAction extends BaseAction implements Action {
  private message: string;

  constructor() {
    super();
    this.message = "error";
  }

  initialize(params: { message: string }): void {
    this.message = params.message;
  }

  async perform(state: any): Promise<string> {
    console.log(this.message);
    return this.message;
  }

  describe(): string {
    return `Produces an error: ${this}`;
  }

  getType(): string {
    return "ErrorAction";
  }
  
}
