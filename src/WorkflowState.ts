export class WorkflowState {
    private state: { [key: string]: any } = {};

    constructor() {
        return new Proxy(this, {
            get: (target, prop: string | symbol, receiver) => {
                if (typeof prop === 'symbol' || prop in target) {
                    return Reflect.get(target, prop, receiver);
                }
                return target.state[prop.toString()];
            },
            set: (target, prop: string | symbol, value) => {
                if (typeof prop === 'symbol' || prop in target) {
                    Reflect.set(target, prop, value);
                } else {
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
