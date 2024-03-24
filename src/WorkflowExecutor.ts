import { Action } from './IAction';
import { Rule } from "./IRule";
import ActionFactory  from './ActionFactory';
import { RulesProcessor } from './RulesProcessor';
import { ActionType } from './types/ActionType';

const pino = require('pino');

// Create a logger instance
const logger = pino({ transport: { target: "pino-pretty", }, });



export class WorkflowExecutor {
    private workcases: any; // Adjust to your workcase structure
    private rules: Rule[] = [];
    private rulesProcessor: RulesProcessor;

    constructor(workcases: any, rulesProcessor: RulesProcessor) {
        this.workcases = workcases;
        this.rulesProcessor = rulesProcessor;

        logger.debug('WorkflowExecutor constructor');
        logger.debug(`Workcases: ${JSON.stringify(workcases)}`);
    }


    async executeWorkcase(workcaseName: string) {
        const workcase = this.workcases[workcaseName];
        logger.debug(`executeWorkcase(${workcaseName})`)
        const initializedActions: ActionType[] = [];

        logger.debug('type of workcase actions');
        logger.debug(typeof workcase.Actions);
        logger.debug('workcase');
        logger.debug(workcase);

        logger.debug(`First loop: Initialize all actions`);
        for (const action of workcase.Actions) {
            logger.debug('type of action');
            logger.debug(typeof action);
            logger.debug(`Initializing action: ${action.Type}`)
            const actionInstance = await ActionFactory.createAction(action.Type);
            actionInstance.initialize(action.Params);
            const actionType: ActionType = {type: action.Type, action: actionInstance};
            logger.debug(`pushing action: ${actionType.type}`)
            initializedActions.push(actionType);
            actionInstance.describe();
        }
      
        logger.debug(`Second loop: Execute all actions`);
        for (const { action, type } of initializedActions) {
            logger.debug(`Executing action: ${type}`);
            const result = await (action as Action).execute( {} );
    
            // Process rules after each action's execution
            const nextStep = this.rulesProcessor.processRules(workcaseName, type, result, {});
            if (nextStep === "halt") break; // Example of handling a rule outcome to halt execution
            // Implement other rule outcome handling (e.g., skip, xfer, etc.)
        }
      }
      
    private evaluateRules(result: string, state: any): string {
        // Iterate through rules and evaluate conditions against the action's result or state
        for (const rule of this.rules) {
            if (this.isConditionMet(rule.condition, state)) {
                return rule.action;
            }
        }
        return 'movenext'; // Default action if no rules are met
    }

    private isConditionMet(condition: string, state: any): boolean {
        // Implement logic to evaluate the condition against the state
        // This could involve parsing the condition string and checking state values
        // For simplicity, assume it returns a boolean indicating if the condition is met
        return eval(condition);
    }
}
