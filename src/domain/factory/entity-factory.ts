import { Injectable } from '@nestjs/common';
import { Board } from '../entities/board/board';
import { ItemsPage } from '../entities/board/item';
import { Workspace } from '../entities/board/workspace';

@Injectable()
export class EntityFactory {
  static createBoard(rawBoard: any): Board {
    if (!rawBoard || typeof rawBoard.name !== 'string') {
      console.log('Falha na criação de instancias de quadros');
      return null;
    }

    return new Board(
      rawBoard.id,
      rawBoard.state,
      rawBoard.name,
      rawBoard.item_terminology,
      rawBoard.items_page.map((item: ItemsPage) => this.createItem(item)),
      this.createWorkspace(rawBoard.workspace),
    );
  }

  // In EntityFactory
  static createWorkspace(rawWorkspace: any): Workspace | null {
    if (!rawWorkspace || typeof rawWorkspace.name !== 'string') {
      console.log('Falha na criação de instancias de areas de trabalhos');
      return null;
    }

    const workspace = new Workspace(
      rawWorkspace.id,
      rawWorkspace.state,
      rawWorkspace.name,
    );

    return Workspace.validate(workspace) ? workspace : null;
  }

  static createItem(rawItem: any): ItemsPage {
    if (!rawItem || typeof rawItem.name !== 'string') {
      console.log('Falha na criação de instancias de items');
      return null;
    }

    return new ItemsPage(rawItem);
  }
}
