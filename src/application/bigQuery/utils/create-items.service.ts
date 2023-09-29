import { Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { TransferResponse } from 'src/domain/entities/transfer';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';

@Injectable()
export class TransferItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(
    coreItems: { [key: string]: string }[],
    table: Table,
  ): Promise<ServiceResponse<TransferResponse | string>> {
    // INSERT IMPLEMENTATION ON BIGQUERY
    if (coreItems.length !== 0) {
      const response = await this.bigQueryRepositoryService.insertRows(
        coreItems,
        table,
      );

      if (response === null) return ResponseFactory.createFailure(null);

      return ResponseFactory.createSuccess(response);
    }

    return ResponseFactory.createFailure(
      'Não há novos items para serem inseridos',
    );
  }
}
