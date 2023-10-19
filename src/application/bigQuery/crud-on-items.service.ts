import { Injectable } from '@nestjs/common';
import { CreateItemsService } from './items/create-items.service';
import { Table } from '@google-cloud/bigquery';
import { FilterItemsService } from './items/filter-items.service';
import {
  BoardTablePairing,
  BoardTablePairs,
} from './utils/board-table-pairing';
import { SharedShape } from '../dtos/core/payload.dto';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

@Injectable()
export class CrudOnItemsService {
  private boardTablePairing = new BoardTablePairing();

  private newItemsStatus: SharedShape = {
    names: [],
    count: 0,
    status: 'Nenhum operação realizada',
  };

  constructor(
    private readonly filterItemsService: FilterItemsService,
    private readonly createItemsService: CreateItemsService, // private readonly bigQueryHandleService: BigQueryHandleService,
  ) {}

  async run(
    mondayBoards: BoardEntity[],
  ): Promise<{ operationStatus: SharedShape }> {
    // // Reset status before running
    // this.resetStatus();

    // // PREPARING BOARDS AND TALBES
    // const boardTablePairing = this.boardTablePairing.run(mondayBoards, tables);

    // // OPERATIONS;
    // await this.operations(boardTablePairing, mondayBoards);

    return;
  }

  // // RUN OPERATIONS
  // private async operations(
  //   boardTablePairing: BoardTablePairs[],
  //   mondayBoards: BoardEntity[],
  // ) {
  //   const transferPromises = boardTablePairing.map(async ({ board, table }) => {
  //     try {
  //       // FILTER ITEMS
  //       const FilteredData = await this.filterItemsService.run(
  //         board,
  //         mondayBoards,
  //       );

  //       if (!FilteredData) {
  //         console.log('Nenhum item filtrado para inserção');
  //       }

  //       const { coreItems, duplicateItems } = FilteredData;

  //       // INSERT ITEMS
  //       await this.create(coreItems, mondayBoards);

  //       // UPDATE ITEMS
  //       // await this.update(duplicateItems, table);
  //     } catch (error) {
  //       console.error(`Failed to process board-table pair: ${error}`);
  //     }
  //   });

  //   await Promise.allSettled(transferPromises);

  //   // Here, you can decide what you want to return when arrays are empty
  //   return {
  //     newItems: this.newItemsStatus ? this.newItemsStatus : null,
  //   };
  // }

  // private resetStatus(): void {
  //   this.newItemsStatus = {
  //     names: [],
  //     count: 0,
  //     status: 'Nenhum operação realizada',
  //   };
  // }
}
