import { Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { TransferResponse } from 'src/application/dtos/bigQuery/items.dto';
import { SharedShape } from 'src/application/dtos/core/payload.dto';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';

@Injectable()
export class CreateItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  // HANDLE NEW ITEMS
  async run(
    coreItems: { [key: string]: string }[],
    table: Table,
  ): Promise<SharedShape> {
    // FAST EXIST IF ANY NEW DATA TO INSERT
    if (coreItems.length === 0) {
      // return {
      //   count: 0,
      //   status: 'Não ha novos items para inserção',
      // };

      return;
    }

    const data = await this.create(coreItems, table);

    // return {
    //   count: data.insertedPayload.length,
    //   status: 'Novos items inseridos',
    // };

    return;
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
