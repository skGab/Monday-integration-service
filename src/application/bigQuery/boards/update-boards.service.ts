import { Injectable } from '@nestjs/common';

import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { TableRepository } from 'src/domain/repositories/bigQuery/table-repository';

@Injectable()
export class UpdateBoardsService {
  constructor(private tableRepositoryService: TableRepository) {}

  async run(
    mondayBoards: BoardEntity[],
    existingTables: string[],
  ): Promise<string[]> {
    try {
      if (mondayBoards.length == 0) {
        return null;
      }

      const filteredBoards = mondayBoards.filter((board) => {
        return existingTables.includes(board.name);
      });

      // const refreshTables = await this.tableRepositoryService.updateTables(
      //   filteredBoards,
      // );

      return;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
