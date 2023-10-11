import { GetDatasetsService } from './dataset/get-datasets.service';
import { GetRowsService } from './rows/get-rows.service';
import { UpdateRowsService } from './rows/update-rows.service';
import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateDatasetService } from './dataset/create-dataset.service';
import { CreateTableService } from './table/create-table.service';

import Credentials from '../security/credentials.json';

import { Workspace } from 'src/domain/entities/board/workspace';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';
import { TransferResponse } from 'src/application/dtos/bigQuery/crud-operations.dto';
import { InsertRowsService } from './rows/insert-rows.service';

@Injectable()
export class BigQueryRepositoryService implements BigQueryRepository {
  private bigQueryClient: BigQuery;
  private readonly location = 'southamerica-east1';
  private readonly logger = new Logger(BigQueryRepositoryService.name);

  constructor(
    private readonly createDatasetService: CreateDatasetService,
    private readonly getDatasetsService: GetDatasetsService,
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

  // TABLES
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

  // ROWS
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

  async insertRows(
    coreItems: any[],
    table: Table,
  ): Promise<TransferResponse | null> {
    return await this.insertRowsService.run(coreItems, table);
  }
  // DATASETS
  async createDatasets(
    datasetsToCreate: Workspace[],
  ): Promise<Dataset[] | null> {
    const promises = datasetsToCreate.map(async (dataset) => {
      const response = await this.createDatasetService.run(
        this.location,
        this.bigQueryClient,
        dataset.name,
      );
      return response;
    });

    const datasets = await Promise.all(promises);

    return datasets;
  }

  async updateDatasets(
    datasetsToUpdated: Workspace[],
  ): Promise<Dataset[] | null> {
    const promises = datasetsToUpdated.map(async (dataset) => {
      const response = await this.createDatasetService.run(
        this.location,
        this.bigQueryClient,
        dataset.name,
      );
      return response;
    });

    const datasets = await Promise.all(promises);

    return datasets;
  }

  async getDatasets(workspaces: Workspace[]): Promise<Dataset[] | null> {
    if (!workspaces) {
      this.logger.error(
        'Nenhuma area encontrado para busca de Datasets no BigQuery',
      );
      return null;
    }

    const datasets = await this.getDatasetsService.run(
      workspaces,
      this.bigQueryClient,
    );

    return datasets;
  }
}
