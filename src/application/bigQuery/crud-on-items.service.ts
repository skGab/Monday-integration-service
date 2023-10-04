import { Injectable } from '@nestjs/common';

import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

import { BodyShape } from 'src/domain/entities/payload';

import { UpdateItemsService } from './crud/update-items.service';
import { CreateItemsService } from './crud/create-items.service';

import { Table } from '@google-cloud/bigquery';
import { Board } from 'src/domain/entities/board/board';
import { CrudOperationsVo } from 'src/domain/valueObjects/crud-operations.vo';
import { BoardsAndTablesAssociation } from './utils/boardsAndTables-association copy';
import { FilterItemsService } from './filter-items.service';

@Injectable()
export class CrudOnItemsService {
  private newItems: BodyShape;
  private updatedItems: BodyShape;
  private excludedItems: BodyShape;

  private boardsAndTablesAssociation = new BoardsAndTablesAssociation();

  constructor(
    private readonly updateItemsService: UpdateItemsService,
    private readonly filterItemsService: FilterItemsService,
    private readonly createItemsService: CreateItemsService,
  ) {}

  async run(
    mondayBoards: Board[],
    bigQueryTables: Table[],
  ): Promise<ServiceResponse<CrudOperationsVo>> {
    const boardTablePairs = this.boardsAndTablesAssociation.run(
      mondayBoards,
      bigQueryTables,
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
        return ResponseFactory.run(Promise.resolve(null));
      }

      const { coreItems, duplicateItems } = data;

      // CREATE NEW ITEMS
      await this.transfer(coreItems, table);

      // UPDATE ITEMS
      await this.update(duplicateItems, table);
    });

    await Promise.all(transferPromises);

    // CREATING INSTANCE OF CRUD OPERATIONS
    const transfer = new CrudOperationsVo(
      this.newItems,
      this.updatedItems,
      this.excludedItems,
    );

    return ResponseFactory.run(Promise.resolve(transfer));
  }

  private async transfer(coreItems: any[], table: Table) {
    // TRANSFER NEW ITEMS
    const { data: insertedItems, error: insertError } =
      await this.createItemsService.run(coreItems, table);

    this.newItems = insertedItems;
  }

  private async update(duplicateItems: any[], table: Table) {
    // UPDATE ITEMS
    const { data: updatedItems, error: updateError } =
      await this.updateItemsService.run(duplicateItems, table);

    this.updatedItems = updatedItems;
  }
}
