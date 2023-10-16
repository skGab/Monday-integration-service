import { Injectable } from '@nestjs/common';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { TableRepository } from 'src/domain/repositories/bigQuery/table-repository';

@Injectable()
export class UpdateBoardsService {
  constructor(private tableRepositoryService: TableRepository) {}

  async run(
    mondayBoards: BoardEntity[],
    existingTables: string[],
  ): Promise<{ updatedTables: SharedShape }> {
    const filteredBoards = mondayBoards.filter((board) => {
      return existingTables.includes(board.name);
    });

    const response = await this.tableRepositoryService.updateTables(
      filteredBoards,
    );

    const updatedTables: SharedShape = {
      names: response,
      count: response.length,
      status: 'Success',
    };

    return { updatedTables };
  }
}
