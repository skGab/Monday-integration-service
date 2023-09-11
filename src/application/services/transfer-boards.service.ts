import { BigQueryService } from './../../infra/api/bigQuery/bigQuery.service';
import { Injectable } from '@nestjs/common';
import { BoardsRepository } from 'src/domain/database/boards-repository';
import { Board } from 'src/domain/entities/board';
import { GetWorkSpacesService } from './get-workspaces.service';

@Injectable()
export class TransferBoardService {
  constructor(
    private boardsRepositoryService: BoardsRepository,
    private bigQueryService: BigQueryService,
    private getWorkSpacesService: GetWorkSpacesService,
  ) {}

  // async execute(boards: Board[]): Promise<Board[]> {
  // const boards = await this.getBoardsService.run();

  //   // const response = await this.boardsRepositoryService.transferAll(boards);
  //   const response = this.
  //   return response;
  // }

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
