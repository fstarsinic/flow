import { WorkflowState } from "./WorkflowState";
const state: any = new WorkflowState();

// Dynamically adding and modifying properties
state.counter = 1;
state.counter += 1;

state.print = { name: "Example Print" };
state.print.name = "Updated Print Name";

// Accessing properties
console.log(state.counter); // Outputs: 2
console.log(state.print.name); // Outputs: "Updated Print Name"

// Using defined methods
state.printState(); // Outputs the current state