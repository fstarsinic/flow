class SharedState {
    public counter: number = 0;
    public previousStates: any[] = [];
    public lastSleepDuration: number = 0;
  
    saveState(): void {
      this.previousStates.push({ counter: this.counter, lastSleepDuration: this.lastSleepDuration });
    }
  
    rollback(): void {
      if (this.previousStates.length > 0) {
        const lastState = this.previousStates.pop();
        this.counter = lastState.counter;
        this.lastSleepDuration = lastState.lastSleepDuration;
      } else {
        console.log("No previous state to rollback to.");
      }
    }
  }
  