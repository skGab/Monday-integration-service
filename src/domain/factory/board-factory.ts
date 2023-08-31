import { Board } from 'src/domain/entities/board';
import { Factory } from './factory';
import { Column } from 'src/domain/entities/column';
import { Group } from 'src/domain/entities/group';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardFactory implements Factory {
  createBoard(boardData: any): Board {
    return Board.create(
      {
        name: boardData.name,
        columns: boardData.columns.map(
          (column: { id: any; title: any; type: any; boardId: any }) =>
            Column.create({
              id: column.id,
              title: column.title,
              type: column.type,
              boardId: column.boardId,
            }),
        ),
        groups: boardData.groups.map(
          (group: { id: any; title: any; boardId: any }) =>
            Group.create({
              id: group.id,
              title: group.title,
              boardId: group.boardId,
            }),
        ),
        items: JSON.parse(boardData.items),
      },
      boardData.folderId.toString(),
    );
  }
}
