import { Injectable } from '@nestjs/common';

import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { BodyShape } from 'src/domain/entities/payload';
import { Table } from '@google-cloud/bigquery';

@Injectable()
export class UpdateItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(
    duplicateItems: { [key: string]: string }[],
    table: Table,
  ): Promise<ServiceResponse<BodyShape>> {
    if (duplicateItems.length === 0) {
      return ResponseFactory.run(
        Promise.resolve({
          names: [],
          count: 0,
        }),
      );
    }

    // UPDATE IMPLEMENTATION ON BIGQUERY
    const data = await this.bigQueryRepositoryService.updateRows(
      duplicateItems,
      table,
    );

    // RETURN UPDATE RESULTS
    const response = {
      names: data.insertedPayload.map((item) => item.solicitacao),
      count: data.insertedPayload.length,
    };

    return ResponseFactory.run(Promise.resolve(response));
  }
}
