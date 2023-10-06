import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';

import { Table } from '@google-cloud/bigquery';

@Injectable()
export class CreateBoardsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  // CREATE BOARDS ON BIGQUERY, FROM MONDAY
  async run(mondayBoards: Board[]): Promise<Table[]> {
    const bigQueryTables =
      this.bigQueryRepositoryService.createTables(mondayBoards);

    if (bigQueryTables === null) return null;

    return bigQueryTables;
  }
}