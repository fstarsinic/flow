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

export class CreateFileAction extends BaseAction implements Action {
  private filePath: string = '';

  initialize(params: { filePath: string }): void {
    this.filePath = params.filePath;
  }

  async perform(): Promise<string> {
    try {
      await fs.writeFile(this.filePath, '');
      return 'success';
    } catch (error) {
      throw new Error('Error creating the file.');
    }
  }

    describe(): string {
        return `Creates a file at the path '${this.filePath}'`;
    }

    getType(): string {
        return 'CreateFileAction';
    }
}
