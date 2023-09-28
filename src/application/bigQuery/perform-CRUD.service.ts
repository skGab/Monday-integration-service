import { UpdateItemsService } from './utils/update-items.service';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from 'src/application/dto/payload.dto';
import { TransferItemsService } from './utils/create-items.service';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { BigQueryResponse } from './bigQuery-handle.service';

@Injectable()
export class PerformCrudOperations {
  constructor(
    private readonly transferItemsService: TransferItemsService,
    private readonly updateItemsService: UpdateItemsService,
  ) {}

  async run(
    payload: PayloadDto,
    bigQueryResponse: BigQueryResponse,
  ): Promise<ServiceResponse<any>> {
    try {
      const transferPromises = bigQueryResponse.boardTablePairs.map(
        async ({ board, table }) => {
          // FILTER ITEMS
          const response = payload.filterItems(
            board,
            bigQueryResponse.bigQueryItemsId,
          );

          if (response.success) {
            const { coreItems, duplicateItems } = response.data;

            // TRANSFER NEW ITEMS
            await this.handleTransfer(payload, coreItems, table);

            // UPDATE ITEMS
            await this.handleUpdate(payload, duplicateItems, table);
          }
        },
      );

      if (transferPromises === null) return null;

      const response = await Promise.all(transferPromises);

      payload.updateStatus({ step: 'Inserção de dados', success: true });

      return ResponseFactory.createSuccess(response);
    } catch (error) {
      payload.updateStatus({
        step: 'Inserção de dados',
        success: false,
        error: error.message,
      });
      return ResponseFactory.createFailure(error.message);
    }
  }

  private async handleTransfer(
    payload: PayloadDto,
    coreItems: any[],
    table: unknown,
  ): Promise<void> {
    const NewItemsStatus = await this.transferItemsService.run(
      coreItems,
      table,
    );

    if (NewItemsStatus.success) {
      if (typeof NewItemsStatus.data === 'string') {
        payload.addTransfer(); // You might want to revise this part based on your logic.
      } else {
        payload.addTransfer(NewItemsStatus.data, undefined); // Pass the board name here
      }
    }
  }

  private async handleUpdate(
    payload: PayloadDto,
    duplicateItems: any[],
    table: unknown,
  ) {
    const UpdateStatus = await this.updateItemsService.run(
      duplicateItems,
      table,
    );

    if (UpdateStatus.success) {
      if (typeof UpdateStatus.data === 'string') {
        payload.addTransfer();
      } else {
        payload.addTransfer(undefined, UpdateStatus.data);
      }
    }
  }
}
