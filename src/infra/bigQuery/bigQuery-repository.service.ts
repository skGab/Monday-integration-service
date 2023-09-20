import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateDatasetService } from './create-dataset.service';
import { CreateTableService } from './create-table.service';

import credentials from '../../../credentials/private.json';

import { BoardVo } from 'src/domain/board/board-vo';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';
import {
  BigQueryRepository,
  TransferResponse,
} from 'src/domain/bigQuery/bigQuery-repository';

@Injectable()
export class BigQueryRepositoryService implements BigQueryRepository {
  private bigQueryClient: BigQuery;
  private readonly location = 'southamerica-east1';
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
        this.location,
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
      this.location,
      this.bigQueryClient,
      boards,
    );

    return tables;
  }

  async transferItemsToBoard(payload, table: Table): Promise<TransferResponse> {
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

  async updateBoardItems(payload: any[], board: BoardVo) {
    try {
      const itemIds = payload.map((item) => item.id_de_elemento);

      const query = `SELECT * FROM ${
        board.name
      } WHERE id_de_elemento IN (${itemIds.join(',')})`;

      // // Run the update queries
      // for (const query of updateQueries) {
      //   const [job] = await this.bigQueryClient.createQueryJob({
      //     query: query,
      //   });
      //   const [rows] = await job.getQueryResults();
      //   // Handle or log the results if needed
      // }

      console.log(query);
      // return { success: true, message: 'Updated successfully.' };
    } catch (error) {
      // Handle or throw the error as per your app's error handling strategy
      console.error('Error updating items in BigQuery:', error);
      throw new Error('Failed to update items in BigQuery.');
    }
  }

  async getItemsFromBoard(board: BoardVo): Promise<string[]> {
    try {
      // Construct a SQL query based on your board. This is just a placeholder
      const sqlQuery = `SELECT id_de_elemento FROM ${board.workspace.name}.${board.name}`;

      const options = {
        query: sqlQuery,
        location: this.location,
      };

      // Run the query on BigQuery
      const [rows] = await this.bigQueryClient.query(options);

      // Extract the id_de_elemento values and return
      return rows.map((row) => row.id_de_elemento);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
