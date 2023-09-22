import { TransferItemsService } from './services/transfer-items.service';
import { GetItemsService } from './services/get-items.service';
import { UpdateItemsService } from './services/update-items.service';
import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateDatasetService } from './services/create-dataset.service';
import { CreateTableService } from './services/create-table.service';

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
    private readonly updateItemsService: UpdateItemsService,
    private readonly getItemsService: GetItemsService,
    private readonly transferItemsService: TransferItemsService,
  ) {
    this.bigQueryClient = new BigQuery({
      projectId: this.configService.get<string>('BIGQUERY_PROJECT_ID'),
      credentials: credentials,
    });
  }

  // CREATE WORKSPACES
  async createWorkspaces(workspaces: WorkspaceVo[]): Promise<string[] | null> {
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

  // CREATE BOARDS
  async createBoards(boards: BoardVo[]): Promise<Table[] | null> {
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
  async transferItemsToBoard(
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

    const itemsId = await this.transferItemsService.run(payload, table);

    return itemsId;
  }

  // UPDATE ITEMS
  async updateBoardItems(
    payload: any[],
    board: BoardVo,
  ): Promise<any[] | null> {
    if (!board) {
      this.logger.error(
        'Nenhum item encontrado para criação de tabelas no BigQuery',
      );
      return null;
    }

    const tables = await this.updateItemsService.run(payload, board);

    return tables;
  }

  // GET ITEMS
  async getItemsFromBoard(board: BoardVo): Promise<string[] | null> {
    if (!board) {
      this.logger.error(
        'Nenhum quadro encontrado para busca de Ids no BigQuery',
      );
      return null;
    }

    const itemsId = await this.getItemsService.run(
      this.location,
      board,
      this.bigQueryClient,
    );

    return itemsId;
  }
}
