import { Injectable } from '@nestjs/common';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { BodyShape } from 'src/application/core/payload.dto';
import { Table } from '@google-cloud/bigquery';
import { Status } from 'src/application/bigQuery/dtos/crud-operations.dto';

@Injectable()
export class UpdateItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(
    duplicateItems: { [key: string]: string }[],
    table: Table,
  ): Promise<Status> {
    if (duplicateItems.length === 0) {
      return { count: 0, status: 'Não ha items para serem atualizados' };
    }

    // UPDATE IMPLEMENTATION ON BIGQUERY
    const data = await this.bigQueryRepositoryService.updateRows(
      duplicateItems,
      table,
    );

    return { count: data.insertedPayload.length, status: 'Items atualizados' };
  }
}
