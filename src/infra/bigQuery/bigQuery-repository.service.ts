import { TransferRowsService } from './services/transfer-rows.service';
import { GetRowsService } from './services/get-rows.service';
import { UpdateRowsService } from './services/update-rows.service';
import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateDatasetService } from './services/create-dataset.service';
import { CreateTableService } from './table/create-table.service';

import credentials from '../../../credentials/private.json';

import { WorkspaceVo } from 'src/domain/board/workspace-vo';
import {
  BigQueryRepository,
  TransferResponse,
} from 'src/domain/bigQuery/bigQuery-repository';
import { Board } from 'src/domain/board/board';

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
    private readonly transferRowsService: TransferRowsService,
  ) {
    this.bigQueryClient = new BigQuery({
      projectId: this.configService.get<string>('BIGQUERY_PROJECT_ID'),
      credentials: credentials,
    });
  }

  // CREATE DATASETS/WORKSPACES
  async createDatasets(workspaces: WorkspaceVo[]): Promise<string[] | null> {
    if (!workspaces || workspaces.length == 0) {
      this.logger.error(
        'Nenhuma area de trabalho encontrada para criação de datasets no BigQuery',
      );
      return null;
    }

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
    payload: any[],
    table: Table,
  ): Promise<TransferResponse | null> {
    if (!table) {
      this.logger.error('Nenhuma tabela encotrada para inserção de items');
      return null;
    }

    if (!payload || payload.length == 0) {
      this.logger.error('Payload vazio para inserção no BigQuery');
      return null;
    }

    const itemsId = await this.transferRowsService.run(payload, table);

    return itemsId;
  }

  // UPDATE ITEMS
  async updateRows(payload: any[], board: Board): Promise<any[] | null> {
    if (!board) {
      this.logger.error(
        'Nenhum item encontrado para criação de tabelas no BigQuery',
      );
      return null;
    }

    const tables = await this.updateRowsService.run(payload, board);

    return tables;
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
