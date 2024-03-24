import { Action } from './IAction';

const pino = require('pino');

// Create a logger instance
const logger = pino({ transport: { target: "pino-pretty", }, });


export default class ActionFactory {


    static async createAction(actionName: string): Promise<Action> {

      logger.debug(`ActionFactory.createAction(${actionName})`);

      try {
        const modulePath = `./actions/${actionName}`;
        const actionModule = await import(modulePath);
        const inst = new actionModule.default() as Action;
        logger.debug(Reflect.ownKeys(inst));

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
  