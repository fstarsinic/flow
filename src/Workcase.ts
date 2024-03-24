import { Action } from './IAction';
import { RulesProcessor } from './RulesProcessor';

interface RuleOutcome {
  action: string;
  targetWorkcase?: string;
}

export class Workcase {
  private actions: Action[];
  private rulesProcessor: RulesProcessor; // Assumes you have a RulesProcessor class
  private name: string;


  constructor(actions: Action[], rulesProcessor: RulesProcessor) {
    this.actions = actions;
    this.rulesProcessor = rulesProcessor;
  }

  // Adds an action to the workcase
  addAction(action: Action): void {
    this.actions.push(action);
  }

  // Execute all actions in the workcase in order
  async execute(state: any): Promise<void> {
    for (const action of this.actions) {
      const result = await action.execute(state);

      // Process rules after each action execution, assuming rulesProcessor can evaluate the result and decide the next steps
      const outcome: RuleOutcome = this.rulesProcessor.processRules(result, state);
      if (outcome.action === 'halt') {
        break; // Stop executing this workcase
      } else if (outcome.action === 'xfer' && outcome.targetWorkcase) {
        // Signal that execution needs to transfer to another workcase
        throw new TransferControlException(outcome.targetWorkcase);
      }
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
