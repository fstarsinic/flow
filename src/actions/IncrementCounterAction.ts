import { WorkflowState } from '../WorkflowState'; // Import the WorkflowState type
import { Action } from '../IAction'; // Import the Action interface

class IncrementCounterAction implements Action {
    initialize(params: any): void {
        // Initialization logic here
    }   

   // Adjusting the WorkflowState type to an any type
    async execute(state: any): Promise<string> {
    state.counter = 0;
    state.counter += 1;
    state.message = `Counter incremented to ${state.counter}.`;
    return "completed";
}

    describe(): string {
        return "Increments the counter and updates the message.";
    }
}
