import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateDatasetService } from './util/create-dataset.service';
import { CreateTableService } from './util/create-table.service';

import credentials from '../../../credentials/private.json';
import { BoardVo } from 'src/domain/board/board-vo';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';

@Injectable()
export class BigQueryRepositoryService implements BigQueryRepository {
  private bigQueryClient: BigQuery;
  private readonly logger = new Logger(BigQueryRepositoryService.name);

  constructor(
    private readonly createDatasetService: CreateDatasetService,
    private readonly createTableService: CreateTableService,
    private readonly configService: ConfigService,
  ) {
    this.bigQueryClient = new BigQuery({
      projectId: this.configService.get<string>('BIGQUERY_PROJECT_ID'),
      credentials: credentials,
    });
  }

  async createWorkspaces(workspaces: WorkspaceVo[]): Promise<string[]> {
    const promises = workspaces.map(async (workspace) => {
      const response = await this.createDatasetService.run(
        this.bigQueryClient,
        workspace.name,
      );
      return response;
    });

    const datasets = await Promise.all(promises);

    return datasets.map((dataset) => {
      return dataset.id;
    });
  }

  async createBoards(boards: BoardVo[]): Promise<Table[]> {
    const tables = await this.createTableService.run(
      this.bigQueryClient,
      boards,
    );

    return tables;
  }

  async transferBoards(items, boards: Table[]) {
    try {
      const transferedDataPromises = boards.map((board) => board.insert(items));
      const results = await Promise.all(transferedDataPromises);

      return results;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
