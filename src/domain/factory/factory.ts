import { Board } from '../entities/board';

export abstract class Factory {
  abstract createBoard(boardData: any): Board;
}
