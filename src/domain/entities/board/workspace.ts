export class Workspace {
  // public tables: any[] = [];
  // public errors: string[] = [];

  constructor(private id: number, public state: string, private name: string) {}

  // Get dataset ID
  getID(): number {
    return this.id;
  }

  // Get dataset name
  getName(): string {
    return this.name;
  }

  // // Get the number of tables in each dataset
  // getNumberOfTables(): number {
  //   return this.tables.length;
  // }

  // // Add an error message
  // addError(error: string): void {
  //   this.errors.push(error);
  // }

  // // Get all error messages
  // getErrors(): string[] {
  //   return this.errors;
  // }

  static validate(workspace: Workspace): boolean {
    const pattern = /^[a-zA-Z0-9_]+$/;
    return pattern.test(workspace.getName().trim());
  }
}
