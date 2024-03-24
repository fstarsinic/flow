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
class SleepAction {
    constructor() {
        this.duration = 0;
    }
    initialize(params) {
        this.duration = params.duration;
    }
    execute(state) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Sleeping for ${this.duration} second(s).`);
            yield new Promise(resolve => setTimeout(resolve, this.duration * 1000));
            state.lastSleepDuration = this.duration;
            return "completed";
        });
    }
    describe() {
        return `Sleeps for ${this.duration} second(s)`;
    }
}
exports.default = SleepAction;
