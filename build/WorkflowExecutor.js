"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutor = void 0;
const ActionFactory_1 = __importDefault(require("./ActionFactory"));
const pino = require('pino');
// Create a logger instance
const logger = pino({ transport: { target: "pino-pretty", }, });
class WorkflowExecutor {
    constructor(workcases, rulesProcessor) {
        this.rules = [];
        this.workcases = workcases;
        this.rulesProcessor = rulesProcessor;
        logger.debug('WorkflowExecutor constructor');
        logger.debug(`Workcases: ${JSON.stringify(workcases)}`);
    }
    executeWorkcase(workcaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const workcase = this.workcases[workcaseName];
            logger.debug(`executeWorkcase(${workcaseName})`);
            const initializedActions = [];
            logger.debug('type of workcase actions');
            logger.debug(typeof workcase.Actions);
            logger.debug('workcase');
            logger.debug(workcase);
            logger.debug(`First loop: Initialize all actions`);
            for (const action of workcase.Actions) {
                logger.debug('type of action');
                logger.debug(typeof action);
                logger.debug(`Initializing action: ${action.Type}`);
                const actionInstance = yield ActionFactory_1.default.createAction(action.Type);
                actionInstance.initialize(action.Params);
                const actionType = { type: action.Type, action: actionInstance };
                logger.debug(`pushing action: ${actionType.type}`);
                initializedActions.push(actionType);
                actionInstance.describe();
            }
            logger.debug(`Second loop: Execute all actions`);
            for (const { action, type } of initializedActions) {
                logger.debug(`Executing action: ${type}`);
                const result = yield action.execute({});
                // Process rules after each action's execution
                const nextStep = this.rulesProcessor.processRules(workcaseName, type, result, {});
                if (nextStep === "halt")
                    break; // Example of handling a rule outcome to halt execution
                // Implement other rule outcome handling (e.g., skip, xfer, etc.)
            }
        });
    }
    evaluateRules(result, state) {
        // Iterate through rules and evaluate conditions against the action's result or state
        for (const rule of this.rules) {
            if (this.isConditionMet(rule.condition, state)) {
                return rule.action;
            }
        }
        return 'movenext'; // Default action if no rules are met
    }
    isConditionMet(condition, state) {
        // Implement logic to evaluate the condition against the state
        // This could involve parsing the condition string and checking state values
        // For simplicity, assume it returns a boolean indicating if the condition is met
        return eval(condition);
    }
}
exports.WorkflowExecutor = WorkflowExecutor;
