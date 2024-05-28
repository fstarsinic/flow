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

  export class WorkflowState {
    private state: { [key: string]: any } = {};

    constructor() {
        return new Proxy(this, {
            get: (target, prop: string | symbol, receiver) => {
                if (typeof prop === 'symbol' || prop in target) {
                    return Reflect.get(target, prop, receiver);
                }
                return target.state[prop.toString()];
            },
            set: (target, prop: string | symbol, value) => {
                if (typeof prop === 'symbol' || prop in target) {
                    Reflect.set(target, prop, value);
                } else {
                    target.state[prop.toString()] = value;
                }
                return true; // Indicates success
            }
        });
    }


    printState() {
        logger.debug(this.state);
    }
}
