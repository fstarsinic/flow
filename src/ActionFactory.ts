import { Action } from './IAction';


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


export default class ActionFactory {


    static async createAction(actionName: string, params: any): Promise<Action> {

      logger.info(`ActionFactory.createAction(${actionName})`);

      try {
        const modulePath = `./actions/${actionName}`;
        logger.info(`Loading action module: ${modulePath}`);
        const actionModule = await import(modulePath);
        const inst = new actionModule.default() as Action;
        logger.info(Reflect.ownKeys(inst));

        return inst as Action;
      } catch (error) {
        logger.error(error)
        logger.error(`Error loading action: ${actionName}`);
        actionName = 'Error';
        const modulePath = `./actions/${actionName}`;
        const actionModule = await import(modulePath);
        return new actionModule.default() as Action;
      }
    }


    // Type guard function to check if an object conforms to the IAction interface
    static isIAction(object: any): object is Action {
      return 'initialize' in object && 'execute' in object && 'describe' in object &&
            typeof object.initialize === 'function' &&
            typeof object.execute === 'function' &&
            typeof object.describe === 'function';
    }

  }
  