import { Injectable } from '@nestjs/common';
import { Board } from '../entities/board/board';
import { Item } from '../entities/board/item';
import { Workspace } from '../entities/board/workspace';

@Injectable()
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

  // In EntityFactory
  static createWorkspace(rawWorkspace: any): Workspace | null {
    if (!rawWorkspace || typeof rawWorkspace.name !== 'string') {
      return null;
    }

    const workspace = new Workspace(
      rawWorkspace.id,
      rawWorkspace.state,
      rawWorkspace.name,
    );

    if (Workspace.validate(workspace)) {
      return workspace;
    } else {
      return null;
    }
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
