export interface Action {
    initialize(params: any): void;
    getType(): string;
    execute(state: any): Promise<string>;
    describe(): string;
  }
  