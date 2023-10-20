import { Injectable } from '@nestjs/common';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { TableRepository } from 'src/domain/repositories/bigQuery/table-repository';

@Injectable()
export class CreateBoardsService {
  constructor(private tableRepositoryService: TableRepository) {}

  // CREATE BOARDS ON BIGQUERY, FROM MONDAY
  async run(mondayBoards: BoardEntity[]): Promise<{
    newTables: SharedShape | string;
    existingTables: string[] | string;
  }> {
    try {
      // CHEKING FOR BOARDS EXISTENCE BEFORE
      if (!mondayBoards && mondayBoards.length == 0) {
        return {
          newTables: 'Nenhum Board encontrado para criação de tabelas',
          existingTables: null,
        };
      }

      // CREATING TABLES
      const { createdTables, existingTables, errors } =
        await this.tableRepositoryService.createTables(mondayBoards);

      // CHEKING FOR
      if (createdTables.length === 0 && errors.length === 0) {
        return {
          newTables: 'Nenhuma tabela recem criada',
          existingTables,
        };
      }

      // BUILDING RESPONSE
      const newTables: SharedShape = {
        names: [...createdTables, ...errors],
        count: createdTables.length,
        status: 'Success',
      };

      if (existingTables.length === 0 && newTables.status === 'Success') {
        return {
          newTables,
          existingTables: newTables.names,
        };
      }

      return { newTables, existingTables };
    } catch (error) {
      return {
        newTables: {
          names: null,
          count: 0,
          status: error.message,
        },
        existingTables: null,
      };
    }
  }
}
