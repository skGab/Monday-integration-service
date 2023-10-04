import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

@Injectable()
export class GetItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(mondayBoards: Board[]): Promise<ServiceResponse<string[]>> {
    // GET EXISTING ROWS FROM TABLES ON BIGQUERY
    const bigQueryItemsId = this.getRows(mondayBoards);

    return ResponseFactory.run(bigQueryItemsId);
  }

  private async getRows(mondayBoards: Board[]) {
    const bigQueryItemsId: string[] = [];

    // GETTING ROWS ON BIGQUERY FROM BOARDS
    for (const board of mondayBoards) {
      const ids = await this.bigQueryRepositoryService.getRows(board);
      bigQueryItemsId.push(...ids);
    }

    return bigQueryItemsId;
  }
}
