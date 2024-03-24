import { WorkflowExecutor } from "./WorkflowExecutor";
import { Workcase } from "./Workcase";

export class Workflow {
    private workcases: Map<string, Workcase>;
    private executionStack: Array<{ name: string; position: number }>;

    constructor(workcases: Map<string, Workcase>) {
        this.workcases = workcases;
        this.executionStack = [];
    }

    async start(workcaseName: string) {
        this.executionStack.push({ name: workcaseName, position: 0 });
        await this.executeCurrentWorkcase();
    }

    private async executeCurrentWorkcase() {
        while (this.executionStack.length > 0) {
            const currentWorkcaseContext = this.executionStack[this.executionStack.length - 1];
            const currentWorkcase = this.workcases.get(currentWorkcaseContext.name);

            if (!currentWorkcase) {
                throw new Error(`Workcase "${currentWorkcaseContext.name}" not found.`);
            }

            // Execute actions starting from the current position
            for (let i = currentWorkcaseContext.position; i < currentWorkcase.actions.length; i++) {
                const actionResult = await currentWorkcase.actions[i].execute(/* state */);
                currentWorkcaseContext.position = i + 1; // Update the position for potential resumption

                const ruleOutcome = currentWorkcase.rulesProcessor.processRules(actionResult, /* state */);
                if (ruleOutcome.action === "xfer") {
                    // Transfer to another workcase, saving the current position
                    this.executionStack.push({ name: ruleOutcome.targetWorkcase, position: 0 });
                    break;
                } else if (ruleOutcome.action === "halt") {
                    // Clear the stack
