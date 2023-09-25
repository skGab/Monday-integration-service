import { Injectable } from '@nestjs/common';

import {
  BigQueryRepository,
  TransferResponse,
} from 'src/domain/repository/bigQuery-repository';

@Injectable()
export class TransferItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(corePayload: any[], table: any): Promise<TransferResponse> {
    // INSERT IMPLEMENTATION ON BIGQUERY
    if (corePayload.length !== 0) {
      const response = await this.bigQueryRepositoryService.insertRows(
        corePayload,
        table,
      );

      if (response === null) return null;

      return response;
    }
  }
}
