import { BigQueryService } from './../../infra/api/bigQuery/bigQuery.service';
import { Injectable } from '@nestjs/common';
import { BoardsRepository } from 'src/domain/database/boards-repository';
import { Board } from 'src/domain/entities/board';
import { Workspaces } from 'src/domain/factory/types';

@Injectable()
export class TransferBoardService {
  constructor(
    private boardsRepositoryService: BoardsRepository,
    private bigQueryService: BigQueryService,
  ) {}

  // async execute(boards: Board[]): Promise<Board[]> {
  //   // const response = await this.boardsRepositoryService.transferAll(boards);
  //   const response = this.
  //   return response;
  // }

  async createWorkSpaces(workspaces: Workspaces[]) {
    const workspacesId = await this.bigQueryService.datasetHandle(workspaces);
    return workspacesId;
  }

  // private toDto(board: Board): BoardDto {
  //   return {

  //   };
  // }
}
