import { WorkflowExecutor } from './WorkflowExecutor';
import { RulesProcessor } from './RulesProcessor';
import * as fs from 'fs';
import { argv } from 'process';
import minimist from 'minimist';

const pino = require('pino');
const logger = pino({ transport: { target: "pino-pretty", }, });

// Write a log statement
logger.info('Hello, this is an info log!');


async function main(workflowConfigFile: string, rulesConfigFile: string, workcaseName: string) {
    try {
        logger.info('Reading the workflow configuration file')
        logger.info(workcaseName);
        // Load the workflow configuration file
        const configFileContent = fs.readFileSync(workflowConfigFile, { encoding: 'utf8' }) as unknown as string;
        const workflowDefinition = JSON.parse(configFileContent);

        // Instantiate the RulesProcessor with the rules file path
        const rulesProcessor = new RulesProcessor(rulesConfigFile);
        await rulesProcessor.loadRules();

        // Assume WorkflowExecutor has been modified to accept a RulesProcessor instance
        //logger.info('Creating a new WorkflowExecutor instance')
        //const executor = new WorkflowExecutor(workflowDefinition.Workcases, rulesProcessor);
        const wf = new Workflow(workflowConfigFile, rulesConfigFile, workcaseName);

        // Execute a specific workcase to start the workflow
        logger.info('Executing the MorningRoutine workcase')
        await executor.executeWorkcase(workcaseName || "MorningRoutine");
    } catch (error) {
        console.error("Failed to execute the workflow:", error);
    }
}


if (require.main === module) {

    const argv = minimist(process.argv.slice(2));

    console.log(argv)
    main('./workflow.json', './rules.json', argv.workcase).catch(console.error);
}

