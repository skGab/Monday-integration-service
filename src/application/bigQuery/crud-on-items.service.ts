import { Injectable } from '@nestjs/common';

import { UpdateItemsService } from './items/update-items.service';
import { CreateItemsService } from './items/create-items.service';

import { Table } from '@google-cloud/bigquery';
import { ItemsJobStatus } from 'src/application/dtos/bigQuery/item-job-status.dto';
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

  // // Class properties to hold aggregated Status
  // private newItemsStatus: SharedShape = {
  //   count: 0,
  //   status: 'Nenhum operação realizada',
  // };
  // private updatedItemsStatus: SharedShape = {
  //   count: 0,
  //   status: 'Nenhum operação realizada',
  // };
  // private excludedItemsStatus: SharedShape = {
  //   count: 0,
  //   status: 'Nenhum operação realizada',
  // };

  constructor(
    private readonly updateItemsService: UpdateItemsService,
    private readonly filterItemsService: FilterItemsService,
    private readonly createItemsService: CreateItemsService, // private readonly bigQueryHandleService: BigQueryHandleService,
  ) {}

  async run(
    mondayBoards: BoardEntity[],
    tables: Table[],
  ): Promise<ItemsJobStatus> {
    // Reset status before running
    // this.resetStatus();

    // PREPARING BOARDS AND TALBES
    // const boardTablePairing = this.boardTablePairing.run(mondayBoards, tables);

    // OPERATIONS
    // await this.operations(boardTablePairing, mondayBoards);

    // CREATING INSTANCE OF CRUD OPERATIONS
    //   return new ItemsDto(
    //     this.newItemsStatus,
    //     this.updatedItemsStatus,
    //     this.excludedItemsStatus,
    //   );
    // }

    return;
  }

  // // RUN OPERATIONS
  // private async operations(
  //   boardTablePairing: BoardTablePairs[],
  //   mondayBoards: Board[],
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
  //       await this.create(coreItems, table);

  //       // UPDATE ITEMS
  //       await this.update(duplicateItems, table);
  //     } catch (error) {
  //       console.error(`Failed to process board-table pair: ${error}`);
  //     }
  //   });

  //   await Promise.allSettled(transferPromises);

  //   // Here, you can decide what you want to return when arrays are empty
  //   return {
  //     newItems: this.newItemsStatus ? this.newItemsStatus : null,
  //     updatedItems: this.updatedItemsStatus ? this.updatedItemsStatus : null,
  //     excludedItems: this.excludedItemsStatus ? this.excludedItemsStatus : null,
  //   };
  // }

  // // CREATE NEW ITEMS
  // private async create(coreItems: any[], table: Table): Promise<Status> {
  //   try {
  //     const insertedItems = await this.createItemsService.run(coreItems, table);

  //     return (this.newItemsStatus = insertedItems);
  //   } catch (err) {
  //     return (this.newItemsStatus = { count: 0, status: err.message });
  //   }
  // }

  // // UPDATE ITEMS
  // private async update(duplicateItems: any[], table: Table) {
  //   try {
  //     const updatedItems = await this.updateItemsService.run(
  //       duplicateItems,
  //       table,
  //     );

  //     this.updatedItemsStatus = updatedItems;
  //   } catch (err) {
  //     return (this.updatedItemsStatus = { count: 0, status: err.messagee });
  //   }
  // }

  // private resetStatus(): void {
  //   this.newItemsStatus = { count: 0, status: 'Nenhum operação realizada' };
  //   this.updatedItemsStatus = { count: 0, status: 'Nenhum operação realizada' };
  //   this.excludedItemsStatus = {
  //     count: 0,
  //     status: 'Nenhum operação realizada',
  //   };
  // }
}
