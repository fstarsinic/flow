import { Action } from "./IAction";

class Module {
    private name: string;
    private action: Action;
  
    constructor(name: string, actionClass: new () => Action, params: any) {
      this.name = name;
      this.action = new actionClass();
      this.action.initialize(params);
    }
  
    async run(state: any): Promise<string> {
      return await this.action.execute(state);
    }
  }
  