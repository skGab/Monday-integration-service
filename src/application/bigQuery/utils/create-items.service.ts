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
  ): Promise<ServiceResponse<TransferResponse>> {
    try {
      const response = this.bigQueryRepositoryService.insertRows(
        coreItems,
        table,
      );

      return ResponseFactory.run(response);
    } catch (error) {
      return { error: error };
    }
  }
}
