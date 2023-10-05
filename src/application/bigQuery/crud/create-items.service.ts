import { Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { BodyShape } from 'src/application/dtos/payload.dto';
import {
  Status,
  TransferResponse,
} from 'src/application/dtos/crud-operations.dto';
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
  ): Promise<Status> {
    // FAST EXIST IF ANY NEW DATA TO INSERT
    if (coreItems.length === 0) {
      return {
        count: 0,
        message: 'Não ha novos items para inserção',
      };
    }

    const data = await this.create(coreItems, table);
    data.insertedPayload;

    return {
      count: data.insertedPayload.length,
      message: 'Novos items inseridos',
    };
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
