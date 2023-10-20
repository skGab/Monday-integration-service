import { Injectable } from '@nestjs/common';
import { BoardEntity } from '../entities/board/board-entity';
import { ItemsEntity, ItemsPage } from '../entities/board/items-entity';
import { WorkspaceEntity } from '../entities/board/workspace-entity';

@Injectable()
export class EntityFactory {
  // BOARD INSTANCE
  static createBoard(rawBoard: BoardEntity): BoardEntity {
    return new BoardEntity(
      rawBoard.type,
      rawBoard.id,
      rawBoard.state,
      this.sanitizeTitle(rawBoard.name),
      this.createItem(rawBoard),
      rawBoard.activity_logs,
      this.createWorkspace(rawBoard.workspace),
    );
  }

  // WORKSPACE INSTANCE
  static createWorkspace(rawWorkspace: any): WorkspaceEntity | null {
    function capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const workspace = new WorkspaceEntity(
      rawWorkspace.id,
      rawWorkspace.state,
      capitalizeFirstLetter(this.sanitizeTitle(rawWorkspace.name)),
    );

    // return workspace.validate(workspace) ? workspace : null;
    return workspace;
  }

  // ITEM ISNTANCE
  static createItem(rawBoard: BoardEntity): ItemsPage {
    if (!rawBoard.items_page) {
      return new ItemsPage([]);
    }

    const items_page = this.sanitize(rawBoard.items_page.items);

    return items_page;
  }

  static sanitize(items: ItemsEntity[]): ItemsPage {
    const sanitizedItems = items.map((item) => {
      const sanitizedColumnValues = item.column_values.map((column_value) => {
        return {
          ...column_value,
          column: {
            title: this.sanitizeTitle(column_value.column.title),
          },
        };
      });

      return { ...item, column_values: sanitizedColumnValues };
    });

    return new ItemsPage(sanitizedItems);
  }

  // REMOVING SPECIAL CHARACTERS AND SPACES FROM COLUMNS TITLES
  static sanitizeTitle(title: string) {
    const specialCharsMap = {
      ç: 'c',
      ã: 'a',
      á: 'a',
      ê: 'e',
      ú: 'u',
    };

    return title
      .toLowerCase() // Convert to lowercase for uniformity
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[çãáêú]/g, (char) => specialCharsMap[char]) // Translate special characters
      .replace(/[^a-zA-Z0-9_]/g, '') // Remove non-alphanumeric characters except underscores
      .replace(/\u00E1/g, 'a');
  }
}
