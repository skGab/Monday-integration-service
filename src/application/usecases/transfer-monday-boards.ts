import { BoardProps } from 'src/domain/entities/board';
import { BoardTransfer } from '../dto/BoardTransfer';

export class TransferMondayBoards {
  constructor(private boardTransfer: BoardTransfer) {}

  async execute(props: BoardProps) {
    const response = this.boardTransfer.transfer(props);
    return response;
  }
}
