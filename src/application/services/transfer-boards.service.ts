import { GetBoardsService } from './get-boards.service';
import { BigQueryService } from './../../infra/api/bigQuery/bigQuery.service';
import { Injectable } from '@nestjs/common';
import { BoardsRepository } from 'src/domain/database/boards-repository';
import { Board } from 'src/domain/entities/board';
import { GetWorkSpacesService } from './get-workspaces.service';

@Injectable()
export class TransferBoardService {
  constructor(
    private getBoardsService: GetBoardsService,
    private boardsRepositoryService: BoardsRepository,
    private bigQueryService: BigQueryService,
    private getWorkSpacesService: GetWorkSpacesService,
  ) {}

  async execute(): Promise<Board[]> {
    const response = await this.getBoardsService.run();

    const boards = await this.boardsRepositoryService.transferAll(response);

    return boards;
  }

  async createWorkSpaces() {
    const response = await this.getWorkSpacesService.run();
    const workspaces = await this.bigQueryService.datasetHandle(response);

    return workspaces;
  }

  // private toDto(board: Board): BoardDto {
  //   return {

  //   };
  // }
}
