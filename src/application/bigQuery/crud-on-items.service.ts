import { Injectable } from '@nestjs/common';

import { UpdateItemsService } from './crud/update-items.service';
import { CreateItemsService } from './crud/create-items.service';

import { Table } from '@google-cloud/bigquery';
import { Board } from 'src/domain/entities/board/board';
import {
  CrudOperationsDto,
  Status,
} from 'src/application/dtos/crud-operations.dto';
import { BoardsAndTablesAssociation } from './utils/boards-And-Tables';
import { FilterItemsService } from './utils/filter-items.service';

@Injectable()
export class CrudOnItemsService {
  private newItems: Status;
  private updatedItems: Status;
  private excludedItems: Status;

  private boardsAndTablesAssociation = new BoardsAndTablesAssociation();

  constructor(
    private readonly updateItemsService: UpdateItemsService,
    private readonly filterItemsService: FilterItemsService,
    private readonly createItemsService: CreateItemsService,
  ) {}

  async run(
    mondayBoards: Board[],
    tables: Table[],
  ): Promise<CrudOperationsDto> {
    // PREPARING BOARDS AND TALBES
    const boardTablePairs = this.boardsAndTablesAssociation.run(
      mondayBoards,
      tables,
    );

    // RUN OPERATIONS
    const transferPromises = boardTablePairs.map(async ({ board, table }) => {
      // FILTER ITEMS
      const { data, error } = await this.filterItemsService.run(
        board,
        mondayBoards,
      );

      if (error) {
        console.log(error);
        return;
      }

      const { coreItems, duplicateItems } = data;

      // CREATE NEW ITEMS
      await this.transfer(coreItems, table);

      // UPDATE ITEMS
      await this.update(duplicateItems, table);
    });

    await Promise.all(transferPromises);

    // CREATING INSTANCE OF CRUD OPERATIONS
    return new CrudOperationsDto(this.newItems, this.updatedItems);
  }

  private async transfer(coreItems: any[], table: Table) {
    // TRANSFER NEW ITEMS
    const insertedItems = await this.createItemsService.run(coreItems, table);
    return (this.newItems = insertedItems);
  }

  private async update(duplicateItems: any[], table: Table) {
    // UPDATE ITEMS
    const updatedItems = await this.updateItemsService.run(
      duplicateItems,
      table,
    );

    this.updatedItems = updatedItems;
  }
}
