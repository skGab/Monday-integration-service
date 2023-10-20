import { CreateBoardsService } from '../bigQuery/boards/create-boards.service';
import { TableJobStatusDto } from '../dtos/bigQuery/table-job-status.dto';
import { Injectable } from '@nestjs/common';
import { MondayHandleService } from './monday-handle.service';
import { TableRepository } from 'src/domain/repositories/bigQuery/table-repository';

@Injectable()
export class BoardsJobHandleService {
  constructor(
    private mondayHandleService: MondayHandleService,
    private createBoardsService: CreateBoardsService,
    private tableRepositoryService: TableRepository,
  ) {}

  // 2 - SEGUNDO JOB: HANDLE TABLES
  async handle(): Promise<TableJobStatusDto> {
    // GET MONDAY BOARDS
    const boardDto = await this.mondayHandleService.getBoards();

    // CREATE TABLES IF NEEDED
    const { existingTables, newTables } = await this.createBoardsService.run(
      boardDto.data,
    );

    // PRECISA RETORNAR NOVAS TABELAS
    // E TABELAS LIMPAS

    // // REFRESH TABLES
    // const refreshedTables = await this.tableRepositoryService.updateTables(
    //   tablesToRefresh,
    // );

    return new TableJobStatusDto(existingTables, newTables, boardDto);
  }
}
