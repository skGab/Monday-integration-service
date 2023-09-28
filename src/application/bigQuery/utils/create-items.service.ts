import { Injectable } from '@nestjs/common';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

import {
  BigQueryRepository,
  TransferResponse,
} from 'src/domain/repository/bigQuery-repository';

@Injectable()
export class TransferItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(
    coreItems: { [key: string]: string }[],
    table: any,
  ): Promise<ServiceResponse<TransferResponse | string>> {
    // INSERT IMPLEMENTATION ON BIGQUERY
    if (coreItems.length !== 0) {
      const response = await this.bigQueryRepositoryService.insertRows(
        coreItems,
        table,
      );

      if (response === null) return null;

      return ResponseFactory.createSuccess(response);
    }

    return ResponseFactory.createSuccess(
      'Não há novos items para serem inseridos',
    );
  }
}
