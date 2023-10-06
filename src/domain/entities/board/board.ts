import { ItemsPage } from './item';
import { Workspace } from './workspace';

export class Board {
  constructor(
    private id: string,
    private state: string,
    private name: string,
    public item_terminology: string,
    public items_page: ItemsPage,
    public workspace: Workspace,
  ) {}

  // Get board ID
  getBoardID(): string {
    return this.id;
  }

  // Get board name
  boardName(): string {
    return this.name;
  }

  // Get board state (Active, Archived, etc.)
  getBoardState(): string {
    return this.state;
  }
}
