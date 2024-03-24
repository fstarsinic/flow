import { Action } from "../IAction";

export default class SleepAction implements Action {
    private duration: number;

    constructor() {
      this.duration = 0;
    }
  
    initialize(params: { duration: number }): void {
      this.duration = params.duration;
    }
  
    async execute(state: any): Promise<string> {
      console.log(`Sleeping for ${this.duration} second(s).`);
      await new Promise(resolve => setTimeout(resolve, this.duration * 1000));
      state.lastSleepDuration = this.duration;
      return "completed";
    }
  
    describe(): string {
      return `Sleeps for ${this.duration} second(s)`;
    }
  }
  
