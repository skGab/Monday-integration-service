import { Board } from 'src/domain/entities/board/board';
import { Item } from 'src/domain/entities/board/item';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { TransferResponse } from 'src/domain/repository/bigQuery-repository';

type FilteredData = {
  coreItems: { [key: string]: string }[]; // Replace 'YourCoreItemType' with the actual type
  duplicateItems: { [key: string]: string }[]; // Replace 'YourDuplicateItemType' with the actual type
};

interface Status {
  step: string;
  success: boolean;
  error?: string;
}

interface Body {
  count: number;
  names: string[];
  message?: string;
}

interface Transfer {
  newItems: Body;
  updatedItems: Body;
  excludedItems: Body;
}

export class PayloadDto {
  private boards: Body;
  private datasetsNames: string[] = [];
  private tablesNames: string[] = [];
  private transfers: Transfer;
  private status: Status[] = [];

  // prazo de entrega realizado
  // prazo de entrega solicitado

  updateStatus(newStatus: Status): void {
    this.status.push(newStatus);
  }

  addTable(table: any): void {
    this.tablesNames.push(table);
  }

  addBoard(mondayBoards: Board[]): void {
    const board = {
      count: mondayBoards.length,
      names: mondayBoards.map((mBoard) => mBoard.getBoardName()),
    };

    this.boards = board;
  }

  addDataset(datasets: string[]): void {
    this.datasetsNames = [...this.datasetsNames, ...datasets];
  }

  addTransfer(
    newItemsStatus?: TransferResponse,
    updatedItemsStatus?: TransferResponse | string[],
  ): void {
    const transfer: Transfer = {
      newItems: { count: 0, names: [] },
      updatedItems: { count: 0, names: [] },
      excludedItems: { count: 0, names: [] },
    };

    if (!newItemsStatus) {
      transfer.newItems.message = 'Nenhum Item novo para ser inserido';
    } else {
      transfer.newItems = {
        count: newItemsStatus.insertedPayload.length,
        names: newItemsStatus.insertedPayload.map((item) => item.solicitacao),
      };
    }

    if (!updatedItemsStatus) {
      transfer.updatedItems.message = 'Nenhum Item para ser atualizado';
    } else {
      if (Array.isArray(updatedItemsStatus)) {
        transfer.updatedItems = {
          count: updatedItemsStatus.length,
          names: updatedItemsStatus,
        };
      } else {
      }
    }

    this.transfers = transfer;
  }

  filterItems(
    board: Board,
    bigQueryItemsID: string[],
  ): ServiceResponse<FilteredData> {
    // GET ITEMS FROM BIGQUERY

    if (bigQueryItemsID === null) return null;

    // PREPARE DATA TO BE INSERT OR UPDATE
    const { coreItems, duplicateItems } = this.preparePayload(
      bigQueryItemsID,
      board,
    );

    return ResponseFactory.createSuccess({
      coreItems,
      duplicateItems,
    });
  }

  private preparePayload(bigQueryItemsId: string[], board: Board) {
    // Prepare individual payloads for each item.
    const prepareItems = board.items.map(this.prepareSinglePayload);

    // Filter out duplicates.
    const { coreItems, duplicateItems } = this.checkDuplicatedItems(
      bigQueryItemsId,
      prepareItems,
    );

    return { coreItems, duplicateItems };
  }

  private checkDuplicatedItems(
    bigQueryItemsId: string[],
    preparedPayloads: Array<{ [key: string]: string }>,
  ) {
    const duplicateItems: Array<{ [key: string]: string }> = [];
    const coreItems: Array<{ [key: string]: string }> = [];

    preparedPayloads.forEach((payload) => {
      if (bigQueryItemsId.includes(payload.id_de_elemento)) {
        duplicateItems.push(payload);
      } else {
        coreItems.push(payload);
      }
    });

    return {
      duplicateItems,
      coreItems,
    };
  }

  private prepareSinglePayload(item: Item): { [key: string]: string } {
    const payload: { [key: string]: string } = {};
    payload.solicitacao = item.name;
    payload.grupo = item.group.title;

    item.column_values.forEach((column: any) => {
      payload[column.title] = column.text;
    });

    return payload;
  }
}
