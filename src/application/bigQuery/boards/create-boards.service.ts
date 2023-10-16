import { Injectable } from '@nestjs/common';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { TableRepository } from 'src/domain/repositories/bigQuery/table-repository';

@Injectable()
export class CreateBoardsService {
  constructor(private tableRepositoryService: TableRepository) {}

  // CREATE BOARDS ON BIGQUERY, FROM MONDAY
  async run(
    mondayBoards: BoardEntity[],
  ): Promise<{ newTables: SharedShape | string; existingTables: string[] }> {
    const { createdTables, existingTables, errors } =
      await this.tableRepositoryService.createTables(mondayBoards);

    if (createdTables.length === 0 && errors.length === 0) {
      return {
        newTables: 'Nenhuma tabela recem criada',
        existingTables,
      };
    }

    const newTables: SharedShape = {
      names: [...createdTables, ...errors],
      count: createdTables.length,
      status: 'Success',
    };

    return { newTables, existingTables };
  }
}
