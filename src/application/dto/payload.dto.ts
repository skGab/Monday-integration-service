import { Board } from 'src/domain/entities/board/board';
import { ResponseFactory } from 'src/domain/factory/response-factory';
import { TransferResponse } from 'src/domain/repository/bigQuery-repository';

interface Status {
  step: string;
  success: boolean;
  error?: string;
}

interface BodyDto {
  count: number;
  names: string[];
}

interface TransferDto {
  newItems: BodyDto;
  updatedItems: BodyDto;
  excludedItems: BodyDto;
}

export class PayloadDto {
  private datasetsNames: string[];
  private tablesNames: string[];
  private boards: BodyDto[] = [];
  private transfers: TransferDto[];
  private status: Status[] = [];

  updateStatus(newStatus: Status): void {
    this.status.push(newStatus);
  }

  addTable(table: any): void {
    this.tablesNames.push(table);
  }

  addBoard(mondayBoards: Board[]) {
    this.boards.map((board) => {
      board.count = mondayBoards.length;
      board.names = mondayBoards.map((mBoard) => mBoard.getBoardName());
    });
  }

  addDataset(datasets: string[]) {
    datasets.map((dataset) => this.datasetsNames.push(dataset));
  }

  addTransfer(newItemsStatus: TransferResponse) {
    this.transfers.map((transfer) => {
      transfer.newItems.count = newItemsStatus.insertedPayload.length;
      transfer.newItems.names = newItemsStatus.insertedPayload.map(
        (item) => item.solicitacao,
      );
    });
  }
}
