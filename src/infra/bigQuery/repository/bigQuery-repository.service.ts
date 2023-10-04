import { GetRowsService } from '../rows/get-rows.service';
import { UpdateRowsService } from '../rows/update-rows.service';
import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateDatasetService } from '../create-dataset.service';
import { CreateTableService } from '../table/create-table.service';

import Credentials from '../../security/credentials.json';

import { Workspace } from 'src/domain/entities/board/workspace';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';
import { TransferResponse } from 'src/domain/valueObjects/crud-operations.vo';
import { InsertRowsService } from '../rows/insert-rows.service';
import { errorMonitor } from 'events';
import { Item } from 'src/domain/entities/board/item';

@Injectable()
export class BigQueryRepositoryService implements BigQueryRepository {
  private bigQueryClient: BigQuery;
  private readonly location = 'southamerica-east1';
  private readonly logger = new Logger(BigQueryRepositoryService.name);

  constructor(
    private readonly createDatasetService: CreateDatasetService,
    private readonly createTableService: CreateTableService,
    private readonly configService: ConfigService,
    private readonly updateRowsService: UpdateRowsService,
    private readonly getRowsService: GetRowsService,
    private readonly insertRowsService: InsertRowsService,
  ) {
    this.bigQueryClient = new BigQuery({
      projectId: this.configService.get<string>('BIGQUERY_PROJECT_ID'),
      credentials: Credentials,
    });
  }

  // CREATE DATASETS/WORKSPACES
  async createDatasets(
    mondayWorkspaces: Workspace[],
  ): Promise<Dataset[] | null> {
    const promises = mondayWorkspaces.map(async (workspace) => {
      const response = await this.createDatasetService.run(
        this.location,
        this.bigQueryClient,
        workspace.getName(),
      );
      return response;
    });

    const datasets = await Promise.all(promises);

    return datasets;
  }

  // CREATE Tables/Boards
  async createTables(boards: Board[]): Promise<Table[] | null> {
    if (!boards || boards.length == 0) {
      this.logger.error(
        'Nenhum quadro encontrado para criação de tabelas no BigQuery',
      );
      return null;
    }

    const tables = await this.createTableService.run(
      this.location,
      this.bigQueryClient,
      boards,
    );

    return tables;
  }

  // TRANSFER ITEMS
  async insertRows(
    coreItems: any[],
    table: Table,
  ): Promise<TransferResponse | null> {
    try {
      const response = await this.insertRowsService.run(coreItems, table);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE ITEMS
  async updateRows(
    duplicateItems: any[],
    table: Table,
  ): Promise<TransferResponse | null> {
    try {
      const response = await this.updateRowsService.run(duplicateItems, table);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // GET ITEMS
  async getRows(board: Board): Promise<string[] | null> {
    if (!board) {
      this.logger.error(
        'Nenhum quadro encontrado para busca de Ids no BigQuery',
      );
      return null;
    }

    const itemsId = await this.getRowsService.run(
      this.location,
      board,
      this.bigQueryClient,
    );

    return itemsId;
  }
}
