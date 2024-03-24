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
Object.defineProperty(exports, "__esModule", { value: true });
class IncrementCounterAction {
    initialize(params) {
        // Initialization logic here
    }
    // Adjusting the WorkflowState type to an any type
    execute(state) {
        return __awaiter(this, void 0, void 0, function* () {
            state.counter = 0;
            state.counter += 1;
            state.message = `Counter incremented to ${state.counter}.`;
            return "completed";
        });
    }
    describe() {
        return "Increments the counter and updates the message.";
    }
}
