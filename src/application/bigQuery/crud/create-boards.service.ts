import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { Table } from '@google-cloud/bigquery';

@Injectable()
export class CreateBoardsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  // CREATE BOARDS ON BIGQUERY, FROM MONDAY
  async run(mondayBoards: Board[]): Promise<ServiceResponse<Table[]>> {
    const bigQueryTables =
      this.bigQueryRepositoryService.createTables(mondayBoards);

    if (bigQueryTables === null) return null;

    bigQueryTables;
    return ResponseFactory.run(bigQueryTables);
  }
}
