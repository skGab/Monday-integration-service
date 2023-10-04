import { GetItemsService } from './crud/get-items.service';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import {
  ServiceResponse,
  ResponseFactory,
} from 'src/domain/factory/response-factory';
import { PreparePayload } from './utils/prepare-payload';

export interface FilteredData {
  coreItems: { [key: string]: string }[];
  duplicateItems: { [key: string]: string }[];
}

@Injectable()
export class FilterItemsService {
  private preparePayload = new PreparePayload();
  constructor(private getItemsService: GetItemsService) {}

  async run(
    board: Board,
    mondayBoards: Board[],
  ): Promise<ServiceResponse<FilteredData>> {
    // GET ITEMS FROM BIGQUERY
    const { data: bigQueryItemsId, error: itemsError } =
      await this.getItemsService.run(mondayBoards);

    if (bigQueryItemsId === null) return null;

    if (itemsError) throw itemsError;

    // PREPARE DATA TO BE INSERT OR UPDATE
    const { coreItems, duplicateItems } = this.preparePayload.run(
      bigQueryItemsId,
      board,
    );

    const data = {
      coreItems,
      duplicateItems,
    };

    return ResponseFactory.run(Promise.resolve(data));
  }
}
