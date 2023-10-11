import { GetItemsService } from './get-items.service';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';

import { PreparePayload } from '../utils/prepare-payload';

export interface FilteredData {
  coreItems: { [key: string]: string }[];
  duplicateItems: { [key: string]: string }[];
}

@Injectable()
export class FilterItemsService {
  private preparePayload = new PreparePayload();
  constructor(private getItemsService: GetItemsService) {}

  async run(board: Board, mondayBoards: Board[]): Promise<FilteredData> {
    // GET ITEMS FROM BIGQUERY
    const bigQueryItemsId = await this.getItemsService.run(mondayBoards);

    if (!bigQueryItemsId) {
      console.log(
        'Não foram  encontrados items no  bigquery para a comparação',
      );
      return null;
    }

    // PREPARE DATA TO BE INSERT OR UPDATE
    const { coreItems, duplicateItems } = this.preparePayload.run(
      bigQueryItemsId,
      board,
    );

    return { coreItems, duplicateItems };
  }
}
