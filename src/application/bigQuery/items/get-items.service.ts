import { Injectable } from '@nestjs/common';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { RowRepository } from 'src/domain/repositories/bigQuery/row-repository';

@Injectable()
export class GetItemsService {
  constructor(private rowRepositoryService: RowRepository) {}

  async run(mondayBoards: BoardEntity[]): Promise<string[]> {
    const bigQueryItemsId: string[] = [];

    // GETTING ROWS ON BIGQUERY FROM BOARDS
    for (const board of mondayBoards) {
      const itemsId = await this.rowRepositoryService.getRows(board);

      if (!itemsId) return;

      bigQueryItemsId.push(...itemsId);
    }

    if (!bigQueryItemsId) return null;

    return bigQueryItemsId;
  }
}
