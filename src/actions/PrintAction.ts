import { Action } from "../IAction";

export default class PrintAction implements Action {
  private message: string;

  constructor() {
    this.message = "";
  }

  initialize(params: { message: string }): void {
    this.message = params.message;
  }

  async execute(state: any): Promise<string> {
    console.log(this.message);
    return "completed";
  }

  describe(): string {
    return `Prints a message: ${this.message}`;
  }
}
