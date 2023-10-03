import { Injectable } from '@nestjs/common';

import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

import { BigQueryResponse } from './bigQuery-handle.service';

import { BodyShape } from 'src/domain/entities/payload';
import { Transfer } from 'src/domain/entities/transfer';

import { UpdateItemsService } from './utils/update-items.service';
import { CreateItemsService } from './utils/create-items.service';

import { PayloadTransformationService } from './utils/payload-transformation.service';
import { Table } from '@google-cloud/bigquery';

@Injectable()
export class PerformCrudService {
  private newItems: BodyShape;
  private updatedItems: BodyShape;
  private excludedItems: BodyShape;

  constructor(
    private readonly updateItemsService: UpdateItemsService,
    private readonly payloadTransformationService: PayloadTransformationService,
    private readonly createItemsService: CreateItemsService,
  ) {}

  async run(
    bigQueryResponse: BigQueryResponse,
  ): Promise<ServiceResponse<Transfer>> {
    const transferPromises = bigQueryResponse.boardTablePairs.map(
      async ({ board, table }) => {
        // FILTER ITEMS
        const { data, error } = this.payloadTransformationService.filterItems(
          board,
          bigQueryResponse.bigQueryItemsId,
        );

        if (error) return { error: error };

        const { coreItems, duplicateItems } = data;

        // TRANSFER NEW ITEMS
        const { data: insertedItems, error: insertError } =
          await this.createItemsService.run(coreItems, table);

        this.newItems = insertedItems;

        // UPDATE ITEMS
        const { data: updatedItems, error: updateError } =
          await this.updateItemsService.run(duplicateItems, table);

        this.updatedItems = updatedItems;
      },
    );

    await Promise.all(transferPromises);

    // Assuming newItems, updatedItems, excludedItems got updated somewhere
    const transfer = new Transfer(
      this.newItems,
      this.updatedItems,
      this.excludedItems,
    );

    return ResponseFactory.run(Promise.resolve(transfer));
  }
}
