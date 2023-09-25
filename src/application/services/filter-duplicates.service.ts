import { Injectable } from '@nestjs/common';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';

import { PreparePayload } from '../utils/prepare-payload';

@Injectable()
export class FilterDuplicatesService {
  constructor(
    private bigQueryRepositoryService: BigQueryRepository,
    private preparePayload: PreparePayload,
  ) {}

  async run(board: Board) {
    // GET ITEMS FROM BIGQUERY
    const bigQueryItemsID = await this.bigQueryRepositoryService.getRows(board);

    if (bigQueryItemsID === null) return null;

    // PREPARE DATA TO BE INSERT OR UPDATE
    const { coreItems, duplicateItems } = this.preparePayload.run(
      bigQueryItemsID,
      board,
    );

    return { coreItems, duplicateItems };
  }
}
