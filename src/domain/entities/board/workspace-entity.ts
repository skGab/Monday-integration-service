export class WorkspaceEntity {
  constructor(private id: string, public state: string, public name: string) {}

  // Get dataset ID
  getId(): string {
    return this.id;
  }

  validate(workspace: WorkspaceEntity): boolean {
    const pattern = /^[a-zA-Z0-9_]+$/;
    return pattern.test(workspace.name.trim());
  }
}
