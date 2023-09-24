import { Board } from './entities/board';
import { Item } from './entities/item';
import { Workspace } from './entities/workspace';

export class EntityFactory {
  static createBoard(rawBoard: any): Board {
    return new Board(
      rawBoard.id,
      rawBoard.state,
      rawBoard.name,
      rawBoard.items.map((item: Item) => this.createItem(item)),
      this.createWorkspace(rawBoard.workspace),
    );
  }

  static createWorkspace(rawWorkspace: any): Workspace {
    return new Workspace(
      rawWorkspace.id,
      rawWorkspace.state,
      rawWorkspace.name,
    );
  }

  static createItem(rawItem: any): Item {
    return new Item(
      rawItem.name,
      rawItem.state,
      rawItem.group,
      rawItem.column_values,
    );
  }
}
