import { DatasetVo } from '../valueObjects/dataset.vo';
import { TableVo } from '../valueObjects/table.vo';
import { Board } from './board/board';
import { Status } from './status';
import { Transfer } from './transfer';

export interface BodyShape {
  count: number;
  names: string[];
  message?: string;
}

export class Payload {
  public boards: BodyShape;

  // prazo de entrega realizado
  // prazo de entrega solicitado
  constructor(
    public tables: TableVo,
    public datasets: DatasetVo,
    public transfers: Transfer,
    public status: Status[] = [],
  ) {}

  addBoard(mondayBoards: Board[]): void {
    const board = {
      count: mondayBoards.length,
      names: mondayBoards.map((mBoard) => mBoard.getBoardName()),
    };

    this.boards = board;
  }
}
