import { Injectable } from '@nestjs/common';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { TransferResponse } from 'src/domain/entities/transfer';

@Injectable()
export class UpdateItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(
    duplicateItems: { [key: string]: string }[],
    table: any,
  ): Promise<ServiceResponse<TransferResponse | string[]>> {
    // UPDATE IMPLEMENTATION ON BIGQUERY
    if (duplicateItems.length !== 0) {
      const updateResult = await this.bigQueryRepositoryService.updateRows(
        duplicateItems,
        table,
      );

      const response = duplicateItems.map((item) => item.solicitacao);

      // return updateResult;
      return ResponseFactory.createSuccess(response);
    }
  }
}
