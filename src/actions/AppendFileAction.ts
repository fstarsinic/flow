import { promises as fs } from 'fs';
import { Action } from '../IAction';

export class AppendFileAction implements Action {
  private filePath: string = '';
  private contentToAppend: string = '';

  initialize(params: { filePath: string; contentToAppend: string }): void {
    this.filePath = params.filePath;
    this.contentToAppend = params.contentToAppend;
  }

  async execute(): Promise<string> {
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
}
