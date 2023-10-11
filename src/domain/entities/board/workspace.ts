export class Workspace {
  constructor(private id: number, public state: string, public name: string) {}

  // Get dataset ID
  getId(): number {
    return this.id;
  }

  static validate(workspace: Workspace): boolean {
    const pattern = /^[a-zA-Z0-9_]+$/;
    return pattern.test(workspace.name.trim());
  }
}
