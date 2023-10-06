export class Workspace {
  constructor(private id: number, public state: string, private name: string) {}

  // Get dataset ID
  getId(): number {
    return this.id;
  }

  // Get dataset name
  workspaceName(): string {
    return this.name;
  }

  static validate(workspace: Workspace): boolean {
    const pattern = /^[a-zA-Z0-9_]+$/;
    return pattern.test(workspace.workspaceName().trim());
  }
}
