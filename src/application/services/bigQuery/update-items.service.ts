import { Injectable } from '@nestjs/common';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { ResponseFactory } from 'src/domain/factory/response-factory';

@Injectable()
export class UpdateItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(duplicateItems: any[], table: any): Promise<ResponseFactory> {
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

      const response = duplicateItems.map(
        (item: { solicitacao: any }) => item.solicitacao,
      );

      // return updateResult;
      return ResponseFactory.createSuccess('Success', response);
    }
  }
}
