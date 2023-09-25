import { Item } from './item';
import { Workspace } from './workspace';

export class Board {
  public errors: string[] = [];

  constructor(
    private id: string,
    private state: string,
    private name: string,
    public items: Item[],
    public workspace: Workspace,
  ) {}

  // Get board ID
  getBoardID(): string {
    return this.id;
  }

  // Get board name
  getBoardName(): string {
    return this.name;
  }

  // Get the number of items in each board
  getNumberOfItems(): number {
    return this.items.length;
  }

  // Get board state (Active, Archived, etc.)
  getBoardState(): string {
    return this.state;
  }

  // Add an error message
  addError(error: string): void {
    this.errors.push(error);
  }

  // Get all error messages
  getErrors(): string[] {
    return this.errors;
  }
}
