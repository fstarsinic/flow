import { WorkflowExecutor } from './WorkflowExecutor';
import { RulesProcessor } from './RulesProcessor';
import * as fs from 'fs';
import minimist, { ParsedArgs } from 'minimist';
import { Workflow } from './Workflow';
import path from 'path';

import { P } from 'pino';
// Create a logger instance
import pino from 'pino';
const log = pino({ transport: { target: "pino-pretty", }, });
// Use path.extname to get the extension of the current file
const fileExtension = path.extname(__filename);
// Use path.basename with the dynamic extension to get the filename without the extension
const fileNameWithoutExtension = path.basename(__filename, fileExtension);
const logger = log.child({
    name: fileNameWithoutExtension,
  });

logger.info('Starting the workflow engine');

//async function main(workflowConfigFile: string, rulesConfigFile: string, workcaseName: string) {
    async function main(argv: ParsedArgs) {
    try {
        logger.info('Reading the workflow configuration file')
        logger.info(argv.workcase);
        logger.info(argv.workflow);
        logger.info(argv.rules);
        const workflowConfigFile = `${process.env.WF}/${argv.workflow}.json`;
        const rulesConfigFile = `${process.env.WF}/${argv.rules}.json`;

        // Define the initial state based on command-line arguments
        const initialState = {
        ...argv  // Spread all parsed arguments into the state
    };

        logger.info(workflowConfigFile);
        logger.info(rulesConfigFile);
        // Load the workflow configuration file
        const configFileContent = fs.readFileSync(workflowConfigFile, { encoding: 'utf8' }) as unknown as string;
        const workflowDefinition = JSON.parse(configFileContent);

        // Load the rules configuration file
        const rulesFileContent = fs.readFileSync(rulesConfigFile, { encoding: 'utf8' }) as unknown as string;
        const rulesDefinition = JSON.parse(rulesFileContent);
        
        const rulesProcessor = new RulesProcessor(rulesConfigFile);
        await rulesProcessor.loadRules();
        logger.info('Rules loaded successfully')

        const workflowExecutor = new WorkflowExecutor(workflowDefinition, rulesProcessor, initialState);
        logger.info(`Executing workcase: ${argv.workcase}`)
        await workflowExecutor.executeWorkcase(argv.workcase);
        logger.info('Workcase executed successfully')

        // Instantiate the RulesProcessor with the rules file path
        const wf = new Workflow(workflowConfigFile, argv._);

    } catch (error) {
        console.error("Failed to execute the workflow:", error);
    }
}


if (require.main === module) {

    const argv = minimist(process.argv.slice(2));
    logger.info(argv)

    logger.info(argv)
    main(argv).catch(console.error);
}

