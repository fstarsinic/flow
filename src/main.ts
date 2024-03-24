import { WorkflowExecutor } from './WorkflowExecutor';
import { RulesProcessor } from './RulesProcessor';
import * as fs from 'fs';
import { argv } from 'process';

const pino = require('pino');

// Create a logger instance
const logger = pino({ transport: { target: "pino-pretty", }, });

// Write a log statement
logger.info('Hello, this is an info log!');


async function main(workflowConfigFile: string, rulesConfigFile: string, workcaseName: string) {
    try {
        // Load the workflow configuration file
        const configFileContent = fs.readFileSync(workflowConfigFile, { encoding: 'utf8' }) as unknown as string;
        const workflowDefinition = JSON.parse(configFileContent);

        // Instantiate the RulesProcessor with the rules file path
        const rulesProcessor = new RulesProcessor(rulesConfigFile);
        await rulesProcessor.loadRules();

        // Assume WorkflowExecutor has been modified to accept a RulesProcessor instance
        logger.info('Creating a new WorkflowExecutor instance')
        const executor = new WorkflowExecutor(workflowDefinition.Workcases, rulesProcessor);

        // Execute a specific workcase to start the workflow
        logger.info('Executing the MorningRoutine workcase')
        await executor.executeWorkcase(workcaseName || "MorningRoutine");
    } catch (error) {
        console.error("Failed to execute the workflow:", error);
    }
}


if (require.main === module) {
    console.log(argv[2])
    main('./workflow.json', './rules.json', argv[2]).catch(console.error);
}

