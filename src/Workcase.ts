import { Action } from './IAction';
import { RulesProcessor } from './RulesProcessor';


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

interface RuleOutcome {
  action: string;
  targetWorkcase?: string;
}

export class Workcase {
  actions: Action[];
  private rulesProcessor: RulesProcessor; // Assumes you have a RulesProcessor class
  name: string;
  Params: any;

  constructor(name: string, actions: Action[], rulesProcessor: RulesProcessor) {
    this.name = 'default';
    this.actions = actions;
    this.Params = {};
    this.rulesProcessor = rulesProcessor;
  }

  // Adds an action to the workcase
  addaction(action: Action): void {
    this.actions.push(action);
  }

  async initializeactions() {
    for (const action of this.actions) {
      await action.initialize(this.Params);
    }


  }
  // Execute all actions in the workcase in order
  async execute(state: any): Promise<void> {
    for (const action of this.actions) {
      const result = await action.execute(state);

      // Process rules after each action execution, assuming rulesProcessor can evaluate the result and decide the next steps
      // const outcome: RuleOutcome = this.rulesProcessor.processRules(result, state);
      //if (outcome.action === 'halt') {
      //  break; // Stop executing this workcase
      //} else if (outcome.action === 'xfer' && outcome.targetWorkcase) {
        // Signal that execution needs to transfer to another workcase
      //  throw new TransferControlException(outcome.targetWorkcase);
      // }
      // Handle other outcomes as needed
    }
  }

  // Additional methods for handling rules, state, etc., can be added here
}

// Custom exception class for handling control transfers between workcases
class TransferControlException extends Error {
  targetWorkcase: string;

  constructor(targetWorkcase: string) {
    super(`Transfer control to ${targetWorkcase}`);
    this.targetWorkcase = targetWorkcase;
  }
}
