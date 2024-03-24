import fs from 'fs';
import { promisify } from 'util';
const pino = require('pino');

// Create a logger instance
const logger = pino({ transport: { target: "pino-pretty", }, });

const readFileAsync = promisify(fs.readFile);

interface Rule {
    actionType: string;
    condition: string;
    nextAction: string;
}

export class RulesProcessor {
    private rules: Record<string, Rule[]> = {};

    constructor(private rulesFilePath: string) {}

    async loadRules(): Promise<void> {
        const rulesContent = await readFileAsync(this.rulesFilePath, { encoding: 'utf8' });
        this.rules = JSON.parse(rulesContent);
    }

    processRules(workcaseName: string, actionType: string, result: string, state: any): string {
        logger.info(`Processing rules for workcase: ${workcaseName}, action: ${actionType}`);
        const workcaseRules = this.rules[workcaseName] || [];
        for (const rule of workcaseRules) {
            logger.info(`Evaluating rule: ${rule.condition}`);
            logger.info(`Action type: ${rule.actionType}`); 
            logger.info(`Next action: ${rule.nextAction}`);
            logger.info(`Result: ${result}`);
            logger.info(`State: ${state}`);
            logger.info(state)
            if (rule.actionType === actionType) {
                const conditionMet = eval(rule.condition.replace('result', JSON.stringify(result)).replace('state', JSON.stringify(state)));
                if (conditionMet) {
                    logger.info(`Rule condition met: ${rule.condition}`);
                    return rule.nextAction;
                } else {
                    logger.warn(`Rule condition not met: ${rule.condition}`);
                }
            }
        }
        return "continue"; // Default action if no rule matches or if workcase has no specific rules
    }
}
