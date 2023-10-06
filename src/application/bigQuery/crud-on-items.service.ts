import { Injectable } from '@nestjs/common';

import { UpdateItemsService } from './items/update-items.service';
import { CreateItemsService } from './items/create-items.service';

import { Table } from '@google-cloud/bigquery';
import { Board } from 'src/domain/entities/board/board';
import {
  CrudOperationsDto,
  Status,
} from 'src/application/bigQuery/dtos/crud-operations.dto';
import { FilterItemsService } from './items/filter-items.service';
import { BoardTablePairing, BoardTablePairs } from './board-table-pairing';

@Injectable()
export class CrudOnItemsService {
  private boardTablePairing = new BoardTablePairing();

  // Class properties to hold aggregated Status
  private newItemsStatus: Status = {
    count: 0,
    status: 'Nenhum operação realizada',
  };
  private updatedItemsStatus: Status = {
    count: 0,
    status: 'Nenhum operação realizada',
  };
  private excludedItemsStatus: Status = {
    count: 0,
    status: 'Nenhum operação realizada',
  };

  constructor(
    private readonly updateItemsService: UpdateItemsService,
    private readonly filterItemsService: FilterItemsService,
    private readonly createItemsService: CreateItemsService,
  ) {}

  async run(
    mondayBoards: Board[],
    tables: Table[],
  ): Promise<CrudOperationsDto> {
    // Reset status before running
    this.resetStatus();

    // PREPARING BOARDS AND TALBES
    const boardTablePairing = this.boardTablePairing.run(mondayBoards, tables);

    // OPERATIONS
    await this.operations(boardTablePairing, mondayBoards);

    // CREATING INSTANCE OF CRUD OPERATIONS
    return new CrudOperationsDto(
      this.newItemsStatus,
      this.updatedItemsStatus,
      this.excludedItemsStatus,
    );
  }

  // RUN OPERATIONS
  private async operations(
    boardTablePairing: BoardTablePairs[],
    mondayBoards: Board[],
  ) {
    const transferPromises = boardTablePairing.map(async ({ board, table }) => {
      try {
        // FILTER ITEMS
        const FilteredData = await this.filterItemsService.run(
          board,
          mondayBoards,
        );

        if (!FilteredData) {
          console.log('Nenhum item filtrado para inserção');
        }

        const { coreItems, duplicateItems } = FilteredData;

        // INSERT ITEMS
        await this.create(coreItems, table);

        // UPDATE ITEMS
        await this.update(duplicateItems, table);
      } catch (error) {
        console.error(`Failed to process board-table pair: ${error}`);
      }
    });

    await Promise.allSettled(transferPromises);

    // Here, you can decide what you want to return when arrays are empty
    return {
      newItems: this.newItemsStatus ? this.newItemsStatus : null,
      updatedItems: this.updatedItemsStatus ? this.updatedItemsStatus : null,
      excludedItems: this.excludedItemsStatus ? this.excludedItemsStatus : null,
    };
  }

  // CREATE NEW ITEMS
  private async create(coreItems: any[], table: Table): Promise<Status> {
    try {
      const insertedItems = await this.createItemsService.run(coreItems, table);

      return (this.newItemsStatus = insertedItems);
    } catch (err) {
      return (this.newItemsStatus = { count: 0, status: err.message });
    }
  }

  // UPDATE ITEMS
  private async update(duplicateItems: any[], table: Table) {
    try {
      const updatedItems = await this.updateItemsService.run(
        duplicateItems,
        table,
      );

      this.updatedItemsStatus = updatedItems;
    } catch (err) {
      return (this.updatedItemsStatus = { count: 0, status: err.messagee });
    }
  }

  private resetStatus(): void {
    this.newItemsStatus = { count: 0, status: 'Nenhum operação realizada' };
    this.updatedItemsStatus = { count: 0, status: 'Nenhum operação realizada' };
    this.excludedItemsStatus = {
      count: 0,
      status: 'Nenhum operação realizada',
    };
  }
}
