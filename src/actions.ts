// actions.ts

interface IAction {
    performAction(): void;
  }
  
  class ActionOne implements IAction {
    performAction() {
      console.log("ActionOne is running");
      // Additional logic
    }
  }
  
  class ActionTwo implements IAction {
    performAction() {
      console.log("ActionTwo is running");
      // Additional logic
    }
  }
  
  export { IAction, ActionOne, ActionTwo };
  