import { UpdateTablesService } from './../table/update-tables.service';
import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { CreateTablesService } from '../table/create-table.service';
import { GetTablesService } from '../table/get-tables.service';

import Credentials from '../../security/credentials.json';

@Injectable()
export class TableRepositoryService {
  private bigQueryClient: BigQuery;
  private readonly location = 'southamerica-east1';
  private readonly logger = new Logger(TableRepositoryService.name);

  constructor(
    private readonly createTableService: CreateTablesService,
    private readonly configService: ConfigService,
    private readonly getTablesService: GetTablesService,
    private readonly updateTablesService: UpdateTablesService,
  ) {
    this.bigQueryClient = new BigQuery({
      projectId: this.configService.get<string>('BIGQUERY_PROJECT_ID'),
      credentials: Credentials,
    });
  }

  // UPDATE TABLES SERVICE
  async updateTables(filteredBoards: BoardEntity[]): Promise<any> {
    const response = await this.updateTablesService.run(
      this.location,
      this.bigQueryClient,
      filteredBoards,
    );

    return response;
  }

  //   CREATE TABLES SERVICE
  async createTables(boards: BoardEntity[]): Promise<{
    createdTables: string[];
    existingTables: string[];
    errors: string[];
  }> {
    const promises = boards.map(async (board) => {
      return await this.createTableService.run(
        this.location,
        this.bigQueryClient,
        board,
      );
    });

    const results = await Promise.allSettled(promises);

    // Extract the value or reason from each settled promise
    const newTables: string[] = [];
    const existingTables: string[] = [];
    const errors: string[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const value = result.value;
        if (value.newTable) {
          newTables.push(value.newTable);
        }
        if (value.existingTable) {
          existingTables.push(value.existingTable);
        }
      } else if (result.status === 'rejected') {
        errors.push(result.reason);
      }
    });

    return { createdTables: newTables, existingTables, errors };
  }

  //   GET TABLES SERVICE
  async getTables(boards: BoardEntity[]): Promise<Table[] | null> {
    if (!boards) {
      this.logger.error(
        'Nenhuma quadro encontrado para busca de Datasets no BigQuery',
      );
      return null;
    }

    const tables = await this.getTablesService.run(this.bigQueryClient, boards);

    if (!tables || tables.length == 0) return null;

    return tables;
  }
}
