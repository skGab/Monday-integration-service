import { BoardProps } from 'src/domain/entities/board';

export interface BoardTransfer {
  transfer(board: BoardProps): Promise<BoardProps | null>;
}
