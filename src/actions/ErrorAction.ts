import { Action } from "../IAction";

export default class ErrorAction implements Action {
  private message: string;

  constructor() {
    this.message = "error";
  }

  initialize(params: { message: string }): void {
    this.message = params.message;
  }

  async execute(state: any): Promise<string> {
    console.log(this.message);
    return this.message;
  }

  describe(): string {
    return `Produces an error: ${this}`;
  }
}
