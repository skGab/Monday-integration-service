import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateDatasetService } from './create-dataset.service';
import { CreateTableService } from './create-table.service';

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

  async transferDataToBoard(payload, table: Table): Promise<any> {
    try {
      await table.insert(payload);
      // When successful, return the table ID and the payload
      return {
        tableId: table.id,
        status: 'success',
        insertedPayload: payload,
      };
    } catch (error) {
      if (error.name === 'PartialFailureError') {
        // Log or handle the rows that failed
        this.logger.error('Failed rows:', error.errors);
        return {
          tableId: table.id,
          status: 'partial_failure',
          errors: error.errors,
        };
      } else {
        this.logger.error(error);
        return {
          tableId: table.id,
          status: 'error',
          error: error.message,
        };
      }
    }
  }
}
