import { Injectable } from '@nestjs/common';
import { Board } from '../entities/board/board';
import { Items, ItemsPage } from '../entities/board/item';
import { Workspace } from '../entities/board/workspace';

@Injectable()
export class EntityFactory {
  // BOARD INSTANCE
  static createBoard(rawBoard: Board): Board {
    return new Board(
      rawBoard.id,
      rawBoard.state,
      rawBoard.name,
      this.createItem(rawBoard.items_page.items),
      this.createWorkspace(rawBoard.workspace),
    );
  }

  // WORKSPACE INSTANCE
  static createWorkspace(rawWorkspace: any): Workspace | null {
    const workspace = new Workspace(
      rawWorkspace.id,
      rawWorkspace.state,
      rawWorkspace.name,
    );

    return Workspace.validate(workspace) ? workspace : null;
  }

  // ITEM ISNTANCE
  static createItem(rawItem: Items[]): ItemsPage {
    const items_page = this.sanitize(rawItem);

    return items_page;
  }

  static sanitize(items): ItemsPage {
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
    };

    return title
      .toLowerCase() // Convert to lowercase for uniformity
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[çãáê]/g, (char) => specialCharsMap[char]) // Translate special characters
      .replace(/[^a-zA-Z0-9_]/g, '') // Remove non-alphanumeric characters except underscores
      .replace(/\u00E1/g, 'a');
  }
}
