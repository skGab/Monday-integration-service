import { UpdateTablesService } from './../table/update-tables.service';
import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { CreateTablesService } from '../table/create-table.service';
import { GetTablesService } from '../table/get-tables.service';

import Credentials from '../../security/credentials.json';
import { TableRepository } from 'src/domain/repositories/bigQuery/table-repository';
import { SharedShape } from 'src/application/dtos/core/payload.dto';

@Injectable()
export class TableRepositoryService implements TableRepository {
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
  async updateTables(
    tablesToRefresh: { oldTable: string; board: BoardEntity }[],
  ): Promise<string | SharedShape> {
    const tables: string[] = [];

    if (tablesToRefresh?.length == 0) {
      return 'Não ha tabelas existentes para atualização';
    }

    for (const data of tablesToRefresh) {
      const table = await this.updateTablesService.run(
        data.oldTable,
        this.bigQueryClient,
        data.board,
      );

      tables.push(table);
    }

    return {
      names: tables,
      count: tables.length,
      status: 'success',
    };
  }

  //   CREATE TABLES SERVICE
  async createTables(boards: BoardEntity[]): Promise<{
    createdTables: string[];
    existingTables: string[];
    errors: string[];
  }> {
    // CREATING TABLES
    const promises = boards.map(async (board) => {
      return await this.createTableService.run(this.bigQueryClient, board);
    });

    // PREPARING RESULTS
    const results = await Promise.allSettled(promises);

    const newTables: string[] = [];
    const existingTables: string[] = [];
    const errors: string[] = [];

    // EXTRACTING THE DATA FROM THE PROMISES RESULT
    // GETTING THE RESULTS AND PUSHING TO THE RIGHT PLACE
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

    return {
      createdTables: newTables,
      existingTables,
      errors,
    };
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
