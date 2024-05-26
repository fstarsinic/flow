import minimist, { ParsedArgs } from 'minimist';
import { Workcase } from './Workcase';
//import * as fs from 'fs';
const pino = require('pino');
const logger = pino({ transport: { target: "pino-pretty", }, });
import { RulesProcessor } from './RulesProcessor';
import ActionFactory from './ActionFactory';
import fs from 'fs/promises';
import { Action } from './IAction';


// Define the structure of a single action configuration
interface ActionConfig {
    Type: string;
    Params: any | null;
}

// Define the structure of the workcase configuration
interface WorkcaseConfig {
    Actions: ActionConfig[];
    RulesSource: string;
    RulesFile: string;
    Rules: any | null;
}

// Define the structure of the overall workflow configuration
interface WorkflowConfig {
    workcases: { [key: string]: WorkcaseConfig };
}

export class Workflow {
    private workcases: Map<string, Workcase>;
    private executionStack: Array<{ name: string; position: number }>;
    private rulesProcessor: RulesProcessor = new RulesProcessor('');
    private state: any;

        constructor(workflowConfigFile: string, cmdArgs: string[]) {
            this.workcases = new Map();
            this.executionStack = [];
            this.state = { ...minimist(cmdArgs) };
            this.loadConfig(workflowConfigFile).catch(console.error);
        }
    
        private async loadConfig(workflowConfigFile: string): Promise<void> {
            try {
                const configContent = await fs.readFile(workflowConfigFile, 'utf8');
                const config = JSON.parse(configContent);
        
                for (const [workcaseName, workcaseConfig] of Object.entries(config.Workcases)) {
                    const actions = await Promise.all((workcaseConfig as WorkcaseConfig).Actions.map(async (actionConfig) => {
                        // Correctly use the updated ActionFactory with type and params
                        return ActionFactory.createAction(actionConfig.Type, actionConfig.Params);
                    }));

                    let rules;
                    if ((workcaseConfig as WorkcaseConfig).RulesSource === 'file') {
                        const rulesContent = await fs.readFile((workcaseConfig as WorkcaseConfig).RulesFile, 'utf8');
                        rules = JSON.parse(rulesContent);
                    } else if ((workcaseConfig as WorkcaseConfig).RulesSource === 'inline') {
                        rules = (workcaseConfig as WorkcaseConfig).Rules;
                    } else {
                        throw new Error(`Unknown RulesSource for workcase '${workcaseName}'`);
                    }
        
                    const rulesProcessor = new RulesProcessor(rules);
                    const workcase = new Workcase(workcaseName, actions, rulesProcessor);
                    this.workcases.set(workcaseName, workcase);
                }
            } catch (error) {
                console.error("Failed to load workflow configuration:", error);
                throw error;
            }
        }
        


    async start() {
        logger.info('start()')
        const initialWorkcaseContext = { name: this.state._workcase, position: 0 };
        logger.info(initialWorkcaseContext)
        this.executionStack.push(initialWorkcaseContext);
        await this.executeCurrentWorkcase();
    }

    public executeWorkcase(workcaseName: string) {
        logger.info(`executeWorkcase(${workcaseName})`)
        const workcase = this.workcases.get(workcaseName);

        if (!workcase) {
            throw new Error(`Workcase ${workcaseName} not found.`);
        }

        const workcaseContext = { name: workcaseName, position: 0 };
        this.executionStack.push(workcaseContext);
        this.executeCurrentWorkcase();
    }

    private async executeCurrentWorkcase() {
        logger.info('executeCurrentWorkcase()')
        while (this.executionStack.length > 0) {
            const currentWorkcaseContext = this.executionStack[this.executionStack.length - 1];
            logger.info(`current workcase: ${currentWorkcaseContext.name}`)
            const currentWorkcase = this.workcases.get(currentWorkcaseContext.name);

            if (!currentWorkcase) {
                throw new Error(`Workcase ${currentWorkcase} not found.`);
            }

            for (let i = currentWorkcaseContext.position; i < currentWorkcase.actions.length; i++) {
                const action = currentWorkcase.actions[i];
                const actionResult = await action.execute(this.state);
                currentWorkcaseContext.position = i + 1; // Update the position

                const ruleOutcome = this.rulesProcessor.processRules(
                    currentWorkcaseContext.name, 
                    action.getType(), 
                    actionResult, 
                    this.state);
            }
        }
    }
}
