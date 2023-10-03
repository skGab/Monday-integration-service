import { Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { BodyShape } from 'src/domain/entities/payload';
import { TransferResponse } from 'src/domain/entities/transfer';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';

@Injectable()
export class CreateItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  // HANDLE NEW ITEMS
  async run(
    coreItems: { [key: string]: string }[],
    table: Table,
  ): Promise<ServiceResponse<BodyShape>> {
    // FAST EXIST IF ANY NEW DATA TO INSERT
    if (coreItems.length === 0) {
      return ResponseFactory.run(
        Promise.resolve({
          names: [],
          count: 0,
        }),
      );
    }

    const data = await this.create(coreItems, table);

    const response = {
      names: data.insertedPayload.map((item) => item.solicitacao),
      count: data.insertedPayload.length,
    };

    return ResponseFactory.run(Promise.resolve(response));
  }

  private async create(
    coreItems: { [key: string]: string }[],
    table: Table,
  ): Promise<TransferResponse> {
    const response = await this.bigQueryRepositoryService.insertRows(
      coreItems,
      table,
    );

    return response;
  }
}
