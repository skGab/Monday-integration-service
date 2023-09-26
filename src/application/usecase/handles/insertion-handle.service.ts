import { UpdateItemsService } from './../../services/bigQuery/update-items.service';
import { Injectable } from '@nestjs/common';
import { FilterDuplicatesService } from '../../services/filter-duplicates.service';
import { PayloadDto } from 'src/application/dto/payload.dto';
import { TransferItemsService } from '../../services/bigQuery/transfer-items.service';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

@Injectable()
export class InsertionHandleService {
  constructor(
    private readonly transferItemsService: TransferItemsService,
    private readonly updateItemsService: UpdateItemsService,
    private readonly filterDuplicatesService: FilterDuplicatesService,
  ) {}

  async run(
    payload: PayloadDto,
    boardTablePairs: any,
  ): Promise<ServiceResponse<any>> {
    try {
      const transferPromises = boardTablePairs.map(async ({ board, table }) => {
        const response = await this.filterDuplicatesService.run(board);

        if (response.success) {
          const { coreItems, duplicateItems } = response.data;

          // TRANSFER NEW ITEMS
          await this.handleTransfer(payload, coreItems, table, board);

          // UPDATE ITEMS
          // await this.handleUpdate(payload, duplicateItems, table);
        }
      });

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
    table: string,
    board: string, // I added this because it seems you want to use the board name
  ): Promise<void> {
    const NewItemsStatus = await this.transferItemsService.run(
      coreItems,
      table,
    );

    if (NewItemsStatus.success) {
      if (typeof NewItemsStatus.data === 'string') {
        payload.addTransfer(); // You might want to revise this part based on your logic.
      } else {
        payload.addTransfer(NewItemsStatus.data, undefined, board); // Pass the board name here
      }
    }
  }

  // private async handleUpdate(
  //   payload: PayloadDto,
  //   duplicateItems: any[],
  //   table: string,
  // ) {
  //   const UpdateStatus = await this.updateItemsService.run(
  //     duplicateItems,
  //     table,
  //   );
  //   if (UpdateStatus.success) {
  //     if (typeof UpdateStatus.data === 'string') {
  //       payload.addTransfer(); // Modify this to handle updated items
  //     } else {
  //       payload.addTransfer(UpdateStatus.data); // Modify this to handle updated items
  //     }
  //   }
  // }
}
