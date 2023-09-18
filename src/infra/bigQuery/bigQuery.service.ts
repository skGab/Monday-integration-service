import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateDatasetService } from './util/create-dataset.service';
import { CreateTableService } from './util/create-table.service';

import credentials from '../../../credentials/private.json';
import { BoardVo } from 'src/domain/board/board-vo';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';

@Injectable()
export class BigQueryService {
  private readonly location = 'southamerica-east1';
  private bigQueryClient: BigQuery;

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

  async workSpaceHandle(workspaces: WorkspaceVo[]): Promise<any[]> {
    const promises = workspaces.map(async (workspace) => {
      const response = await this.createDatasetService.run(
        this.bigQueryClient,
        workspace.name,
        this.location,
      );
      return response;
    });

    const datasets = await Promise.all(promises);

    return datasets.map((dataset) => {
      return dataset.id;
    });
  }

  async tableHandle(boards: BoardVo[]) {
    const tables = await this.createTableService.run(
      this.bigQueryClient,
      boards,
    );

    return tables;
  }

  async transferBoards(items, tables: Table[]) {
    const transferedData = tables.map(async (table) => {
      return await table.insert(items);
    });

    console.log('Dados inseeridos', transferedData);
    return transferedData;
  }
}
