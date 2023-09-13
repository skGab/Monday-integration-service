import { Injectable } from '@nestjs/common';
import { Table } from '@google-cloud/bigquery';
import { BigQueryService } from '../api/bigQuery.service';
import { BigQueryRepository } from 'src/domain/database/bigQuery-repository';
import { BoardVo, ItemVo, WorkspaceVo } from 'src/domain/valueObjects/board-vo';
import { ItemDto } from 'src/application/dto/item.dto';

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

  async transferBoards(items: ItemDto[], tables: Table[]) {
    const response = await this.bigQueryService.transferBoards(items, tables);

    if (!response) {
      return null;
    }

    return response;
  }
}
