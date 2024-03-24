"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WorkflowExecutor_1 = require("./WorkflowExecutor");
const RulesProcessor_1 = require("./RulesProcessor");
const fs = __importStar(require("fs"));
const process_1 = require("process");
const pino = require('pino');
// Create a logger instance
const logger = pino({ transport: { target: "pino-pretty", }, });
// Write a log statement
logger.info('Hello, this is an info log!');
function main(workflowConfigFile, rulesConfigFile, workcaseName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Load the workflow configuration file
            const configFileContent = fs.readFileSync(workflowConfigFile, { encoding: 'utf8' });
            const workflowDefinition = JSON.parse(configFileContent);
            // Instantiate the RulesProcessor with the rules file path
            const rulesProcessor = new RulesProcessor_1.RulesProcessor(rulesConfigFile);
            yield rulesProcessor.loadRules();
            // Assume WorkflowExecutor has been modified to accept a RulesProcessor instance
            logger.info('Creating a new WorkflowExecutor instance');
            const executor = new WorkflowExecutor_1.WorkflowExecutor(workflowDefinition.Workcases, rulesProcessor);
            // Execute a specific workcase to start the workflow
            logger.info('Executing the MorningRoutine workcase');
            yield executor.executeWorkcase(workcaseName || "MorningRoutine");
        }
        catch (error) {
            console.error("Failed to execute the workflow:", error);
        }
    });
}
if (require.main === module) {
    console.log(process_1.argv[2]);
    main('./workflow.json', './rules.json', process_1.argv[2]).catch(console.error);
}
