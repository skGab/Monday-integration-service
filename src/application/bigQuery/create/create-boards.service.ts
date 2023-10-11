import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

import { Table } from '@google-cloud/bigquery';

@Injectable()
export class CreateBoardsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  // CREATE BOARDS ON BIGQUERY, FROM MONDAY
  async run(mondayBoards: BoardEntity[]): Promise<Table[]> {
    const bigQueryTables = await this.bigQueryRepositoryService.createTables(
      mondayBoards,
    );

    if (bigQueryTables === null) return null;

    return bigQueryTables;
  }
}
