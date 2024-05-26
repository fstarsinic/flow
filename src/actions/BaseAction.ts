import { Action } from "../IAction";
import handlebars from 'handlebars';


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


export abstract class BaseAction implements Action {
    protected params: any; // Parameters for the action
    protected abstract perform(state: any): Promise<string>; // To be implemented by subclasses

    getType(): string {
        return this.constructor.name;
    }
    
    initialize (params: any) {
        logger.info(`BaseAction.initialize(${params}`);
        this.params = params;
    }

    // The execute method that all actions will use
    async execute(state: any): Promise<string> {
        //print out each state key,value pair in the state object
        Object.keys(state).forEach(key => {
            logger.info(`state.${key} = ${state[key]}`);
        });
        this.processParams(state);
        return this.perform(state);
    }

    // Handlebars to process template strings within params
    protected processParams(state: any): void {
        logger.info('Processing params()');
        if (!state) {
            logger.error('No state provided');
            return;
        }
        if (!this.params) {
            logger.error('No params provided');
            return;
        }
        logger.info('params key, value pairs')        
        Object.keys(this.params).forEach(key => {
            logger.info(`this.params.${key} = ${this.params[key]}`);
            if (typeof this.params[key] === 'string') {
                logger.info(`compiling a string param: ${this.params[key]}`)
                const template = handlebars.compile(this.params[key]);
                const processedState = template(state);
                logger.info(`processedState: ${processedState}`);
                this.params[key] = processedState;
                state[key] = processedState;
            }
        });
    }

    private replaceTemplateString(template: string, state: any): string {
        return template.replace(/\$\{(\w+)\}/g, (_, key) => state[key] || '');
    }

    describe(): string {
        // Add implementation here
        return "";
    }
}
