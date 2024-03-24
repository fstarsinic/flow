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
exports.RulesProcessor = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const pino = require('pino');
// Create a logger instance
const logger = pino({ transport: { target: "pino-pretty", }, });
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
class RulesProcessor {
    constructor(rulesFilePath) {
        this.rulesFilePath = rulesFilePath;
        this.rules = {};
    }
    loadRules() {
        return __awaiter(this, void 0, void 0, function* () {
            const rulesContent = yield readFileAsync(this.rulesFilePath, { encoding: 'utf8' });
            this.rules = JSON.parse(rulesContent);
        });
    }
    processRules(workcaseName, actionType, result, state) {
        logger.info(`Processing rules for workcase: ${workcaseName}, action: ${actionType}`);
        const workcaseRules = this.rules[workcaseName] || [];
        for (const rule of workcaseRules) {
            logger.info(`Evaluating rule: ${rule.condition}`);
            logger.info(`Action type: ${rule.actionType}`);
            logger.info(`Next action: ${rule.nextAction}`);
            logger.info(`Result: ${result}`);
            logger.info(`State: ${state}`);
            logger.info(state);
            if (rule.actionType === actionType) {
                const conditionMet = eval(rule.condition.replace('result', JSON.stringify(result)).replace('state', JSON.stringify(state)));
                if (conditionMet) {
                    logger.info(`Rule condition met: ${rule.condition}`);
                    return rule.nextAction;
                }
                else {
                    logger.warn(`Rule condition not met: ${rule.condition}`);
                }
            }
        }
        return "continue"; // Default action if no rule matches or if workcase has no specific rules
    }
}
exports.RulesProcessor = RulesProcessor;
