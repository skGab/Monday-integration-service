import { Injectable } from '@nestjs/common';
import { BigQueryService } from '../api/bigQuery/bigQuery.service';
import { BigQueryRepository } from 'src/domain/database/bigQuery-repository';
import { BoardVo, WorkspaceVo } from 'src/domain/valueObjects/board-vo';

@Injectable()
export class BigQueryRepositoryService implements BigQueryRepository {
  constructor(private bigQueryService: BigQueryService) {}

  async createBoards(boards: BoardVo[]) {
    const response = await this.bigQueryService.tableHandle(boards);

    if (!response) {
      return null;
    }

    return response;
  }

  async createWorkspaces(workspaces: WorkspaceVo[]): Promise<any[]> {
    const response = await this.bigQueryService.workSpaceHandle(workspaces);

    if (!response) {
      return null;
    }

    return response;
  }

  async transferAllBoards(boards: BoardVo[]) {}
}
