import { Injectable } from '@nestjs/common';
import { Table } from '@google-cloud/bigquery';
import { BigQueryService } from './bigQuery.service';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { BoardVo } from 'src/domain/board/board-vo';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';

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

  async createWorkspaces(workspaces: WorkspaceVo[]) {
    const response = await this.bigQueryService.workSpaceHandle(workspaces);

    if (!response) {
      return null;
    }

    return response;
  }

  async transferBoards(items, tables: Table[]) {
    const response = await this.bigQueryService.transferBoards(items, tables);

    if (!response) {
      return null;
    }

    return response;
  }
}
