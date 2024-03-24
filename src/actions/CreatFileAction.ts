import { promises as fs } from 'fs';
import { Action } from '../IAction';

export class CreateFileAction implements Action {
  private filePath: string = '';

  initialize(params: { filePath: string }): void {
    this.filePath = params.filePath;
  }

  async execute(): Promise<string> {
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
}
