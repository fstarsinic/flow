export interface Action {
    initialize(params: any): void;
    execute(state: any): Promise<string>;
    describe(): string;
  }
  