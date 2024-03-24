export class WorkflowHelper 
{
 
static replaceDynamicExpressions(expression: string, state: any): string {
    const regex = /\$\{([^}]+)\}/g; // Matches expressions like ${...}
    return expression.replace(regex, (_, path) => {
      try {
        // Split the path and reduce it to the actual value
        return path.split('.').reduce((acc: any, part: any) => acc[part], state);
      } catch (error) {
        console.warn(`Failed to replace dynamic expression: ${path}`, error);
        return "";
      }
    });
  }

  static evaluateCondition(condition: string, state: any): boolean {
    // Example condition: "state.this.that === 'value'"
    // Dynamically extract the "state.this.that" part for evaluation
    const [path, expectedValue] = condition.split('===').map(s => s.trim());
    const dynamicValue = path.split('.').reduce((acc: any, part: string) => acc[part], state);
  
    return dynamicValue === expectedValue; // Dynamically compare the values
  }
  



}