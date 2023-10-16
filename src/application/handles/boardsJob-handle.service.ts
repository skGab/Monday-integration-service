import { CreateBoardsService } from '../bigQuery/boards/create-boards.service';
import {
  OperationStatus,
  TableJobStatusDto,
} from '../dtos/bigQuery/table-job-status.dto';
import { Injectable } from '@nestjs/common';
import { MondayHandleService } from './monday-handle.service';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

@Injectable()
export class BoardsJobHandleService {
  constructor(
    private mondayHandleService: MondayHandleService,
    private createBoardsService: CreateBoardsService,
  ) {}

  // 2 - SEGUNDO JOB: HANDLE TABLES
  async handleTablesJob(): Promise<TableJobStatusDto> {
    // GET MONDAY BOARDS
    const mondayDto = await this.mondayHandleService.getBoards();

    // CREATE TABLES IF NEEDED
    const response = await this.createTables(mondayDto.data);

    // UPDATE IF NEEDED

    // const newTables: SharedShape = {
    //   names: tablesToCreate,
    //   count: tablesToCreate.length,
    //   status: 'Success',
    // };

    // const updatedTables: SharedShape = {
    //   names: tablesToUpdate.flatMap((table) => table.names),
    //   count: tablesToUpdate.length,
    //   status: 'Success',
    // };

    return response;
  }

  // CREATE TABLES
  private async createTables(
    mondayBoards: BoardEntity[],
  ): Promise<TableJobStatusDto> {
    try {
      if (!mondayBoards && mondayBoards.length == 0) {
        return new TableJobStatusDto(
          'Nenhum Board encontrado para criação de tabelas',
        );
      }

      // CREATE TABLES AND RETURN EXISTING ONES
      const { newTables, existingTables } = await this.createBoardsService.run(
        mondayBoards,
      );

      // // UPDATE TABLES
      // const { updatedTables } = await this.updatedBoardsService.run(
      //   mondayBoards,
      //   existingTables,
      // );

      // RESPONSES
      const operationStatus: OperationStatus = {
        newTables,
      };

      return new TableJobStatusDto(
        'MondayBoards',
        existingTables,
        operationStatus,
      );
    } catch (error) {
      return new TableJobStatusDto(error.message);
    }
  }
}
