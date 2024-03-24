"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowState = void 0;
class WorkflowState {
    constructor() {
        this.state = {};
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (typeof prop === 'symbol' || prop in target) {
                    return Reflect.get(target, prop, receiver);
                }
                return target.state[prop.toString()];
            },
            set: (target, prop, value) => {
                if (typeof prop === 'symbol' || prop in target) {
                    Reflect.set(target, prop, value);
                }
                else {
                    target.state[prop.toString()] = value;
                }
                return true; // Indicates success
            }
        });
    }
    printState() {
        console.log(this.state);
    }
}
exports.WorkflowState = WorkflowState;
