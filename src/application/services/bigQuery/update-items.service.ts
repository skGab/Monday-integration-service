import { Injectable } from '@nestjs/common';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { Item } from 'src/domain/entities/board/item';

@Injectable()
export class UpdateItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(
    duplicateItems: { [key: string]: string }[],
    table: any,
  ): Promise<ServiceResponse<string[]>> {
    // UPDATE IMPLEMENTATION ON BIGQUERY
    if (duplicateItems.length !== 0) {
      // const updateResult =
      //   await this.bigQueryRepositoryService.updateBoardItems(
      //     duplicateItems,
      //     board,
      //   );

      // if (updateResult === null) {
      //   throw new Error(`Failed to update items for board: ${board}`);
      // }
      const response = duplicateItems.map((item) => item.solicitacao);
      // console.log(duplicateItems);

      // return updateResult;
      return ResponseFactory.createSuccess(response);
    }
  }
}
