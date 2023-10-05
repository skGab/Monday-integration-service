export class Workspace {
  // public tables: any[] = [];
  // public errors: string[] = [];

  constructor(private id: number, public state: string, private name: string) {}

  // Get dataset ID
  getId(): number {
    return this.id;
  }

  // Get dataset name
  getName(): string {
    return this.name;
  }

  static validate(workspace: Workspace): boolean {
    const pattern = /^[a-zA-Z0-9_]+$/;
    return pattern.test(workspace.getName().trim());
  }
}
