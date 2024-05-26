import { promises as fs } from 'fs';
import { Action } from '../IAction';
import { BaseAction } from './BaseAction';


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

export class AppendFileAction extends BaseAction implements Action {
  private filePath: string = '';
  private contentToAppend: string = '';

  initialize(params: { filePath: string; contentToAppend: string }): void {
    this.filePath = params.filePath;
    this.contentToAppend = params.contentToAppend;
  }

  async perform(): Promise<string> {
    try {
      await fs.appendFile(this.filePath, this.contentToAppend);
      return 'success';
    } catch (error) {
      throw new Error('Error appending to file: File may not exist.');
    }
  }

    describe(): string {
        return `Appends the content '${this.contentToAppend}' to the file '${this.filePath}'`;
    }

    getType(): string {
        return 'AppendFileAction';
    }
}
