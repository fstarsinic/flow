import { Action } from './IAction';
import { Rule } from "./IRule";
import ActionFactory  from './ActionFactory';
import { RulesProcessor } from './RulesProcessor';
import { ActionType } from './types/ActionType';


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


export class WorkflowExecutor {
    private workflow: any; // Adjust to your workcase structure
    private rules: Rule[] = [];
    private rulesProcessor: RulesProcessor;
    private state: any;

    constructor(workflow: any, rulesProcessor: RulesProcessor, state: any) {
        this.workflow = workflow;
        this.rulesProcessor = rulesProcessor;
        this.state = state;

        logger.info('WorkflowExecutor constructor');
        //logger.info(`Workcases: ${JSON.stringify(workcases)}`);
    }


    async executeWorkcase(workcaseName: string): Promise<void> {
        const workcase = this.workflow['Workcases'][workcaseName];
        logger.info(`executeWorkcase(${workcaseName})`)
        logger.info(this.workflow['Workcases'][workcaseName])
        const initializedActions: ActionType[] = [];

        logger.info('workcase');
        logger.info(workcase);

        logger.info(`First loop: Initialize all actions`);
        for (const action of workcase.Actions) {
            logger.info(`Initializing action: ${action.Type}`)
            const actionInstance = await ActionFactory.createAction(action.Type, action.Params);
            actionInstance.initialize(action.Params);
            const actionType: ActionType = {type: action.Type, action: actionInstance};
            logger.info(`pushing action: ${actionType.type}`)
            initializedActions.push(actionType);
            actionInstance.describe();
        }
      
        logger.info(`Second loop: Execute all actions`);
        for (const { action, type } of initializedActions) {
            logger.info(`Executing action: ${type}`);
            const result = await (action as Action).execute(this.state);
    
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
