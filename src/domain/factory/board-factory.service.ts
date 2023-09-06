import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board';
import { BoardResponse } from './types';

export abstract class Factory {
  abstract createBoard(boardData: BoardResponse): Board;
}

@Injectable()
export class BoardFactoryService implements Factory {
  createBoard(boardData: BoardResponse): Board {
    return new Board({
      id: boardData.id,
      name: boardData.name,
      items: boardData.items,
      workspace: boardData.workspace,
    });
  }
}
