import { Injectable } from '@nestjs/common';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

import { PreparePayload } from '../utils/prepare-payload';

type FilteredData = {
  coreItems: { [key: string]: string }[]; // Replace 'YourCoreItemType' with the actual type
  duplicateItems: { [key: string]: string }[]; // Replace 'YourDuplicateItemType' with the actual type
};

@Injectable()
export class FilterDuplicatesService {
  private preparePayload = new PreparePayload();

  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(board: Board): Promise<ServiceResponse<FilteredData>> {
    // GET ITEMS FROM BIGQUERY
    const bigQueryItemsID = await this.bigQueryRepositoryService.getRows(board);

    if (bigQueryItemsID === null) return null;

    // PREPARE DATA TO BE INSERT OR UPDATE
    const { coreItems, duplicateItems } = this.preparePayload.run(
      bigQueryItemsID,
      board,
    );

    return ResponseFactory.createSuccess({
      coreItems,
      duplicateItems,
    });
  }
}
