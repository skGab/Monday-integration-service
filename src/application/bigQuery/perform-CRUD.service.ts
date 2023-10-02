import { Injectable } from '@nestjs/common';

import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

import { BigQueryResponse } from './bigQuery-handle.service';

import { BodyShape } from 'src/domain/entities/payload';
import { Transfer } from 'src/domain/entities/transfer';

import { UpdateItemsService } from './utils/update-items.service';
import { TransferItemsService } from './utils/create-items.service';

import { PayloadTransformationService } from './../usecase/payload-transformation.service';
import { Table } from '@google-cloud/bigquery';

@Injectable()
export class PerformCrudOperations {
  private newItems: BodyShape;
  private updatedItems: BodyShape;
  private excludedItems: BodyShape;

  constructor(
    private readonly transferItemsService: TransferItemsService,
    private readonly updateItemsService: UpdateItemsService,
    private readonly payloadTransformationService: PayloadTransformationService,
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
        this.newItems = await this.handleTransfer(coreItems, table);

        // UPDATE ITEMS
        // await this.handleUpdate(payload, duplicateItems, table);
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

  private async handleTransfer(coreItems: any[], table: Table): Promise<any> {
    const { data: newItemStatus, error } = await this.transferItemsService.run(
      coreItems,
      table,
    );

    return newItemStatus;
  }

  // private async handleUpdate(
  //   payload: Payload,
  //   duplicateItems: any[],
  //   table: unknown,
  // ) {
  //   const UpdateStatus = await this.updateItemsService.run(
  //     duplicateItems,
  //     table,
  //   );

  //   if (UpdateStatus.success) {
  //     if (typeof UpdateStatus.data === 'string') {
  //       payload.addTransfer();
  //     } else {
  //       payload.addTransfer(undefined, UpdateStatus.data);
  //     }
  //   }
  // }
}
