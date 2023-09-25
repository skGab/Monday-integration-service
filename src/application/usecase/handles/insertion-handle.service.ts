import { UpdateItemsService } from './../../services/bigQuery/update-items.service';
import { Injectable } from '@nestjs/common';

import { FilterDuplicatesService } from '../../services/filter-duplicates.service';

import { PayloadDto } from 'src/application/dto/payload.dto';
import { BoardTablePairs } from 'src/application/usecase/handles/bigQuery-handle.service';
import { TransferItemsService } from '../../services/bigQuery/transfer-items.service';
import { ResponseFactory } from 'src/domain/factory/response-factory';

@Injectable()
export class InsertionHandleService {
  constructor(
    private transferItemsService: TransferItemsService,
    private updateItemsService: UpdateItemsService,
    private filterDuplicatesService: FilterDuplicatesService,
  ) {}

  async run(
    payload: PayloadDto,
    boardTablePairs: BoardTablePairs[],
  ): Promise<ResponseFactory> {
    try {
      // LOOPING THROUGHT AN ARRAY OF BOARDS AND TABLES
      // FOR EACH BOARD I'LL FILTER THE DUPLICATES
      // AND TRANSFER THE DATA

      const transferPromises = boardTablePairs.map(async ({ board, table }) => {
        // FILTER DUPLICATES
        const { coreItems, duplicateItems } =
          await this.filterDuplicatesService.run(board);

        // INSERT NEW ITEMS
        const NewItemsStatus = await this.transferItemsService.run(
          coreItems,
          table,
        );
        payload.addTransfer(NewItemsStatus);

        // INSERT ITEMS TO UPDATE
        await this.updateItemsService.run(duplicateItems, table);
        // EXCLUDE ITEMS
      });

      if (transferPromises === null) return null;

      const response = await Promise.all(transferPromises);

      payload.updateStatus({
        step: 'InsertionService',
        success: true,
      });

      return ResponseFactory.createSuccess('Success', response);
    } catch (error) {
      payload.updateStatus({
        step: 'SetupColumnsAndTables',
        success: false,
        error: error.message,
      });
      return { success: false };
    }
  }
}
