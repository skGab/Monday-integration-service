import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TransferResponse } from 'src/application/dtos/bigQuery/item-job-status.dto';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { GetRowsService } from '../rows/get-rows.service';
import { InsertRowsService } from '../rows/insert-rows.service';
import { UpdateRowsService } from '../rows/update-rows.service';

import Credentials from '../../security/credentials.json';

@Injectable()
export class RowRepositoryService {
  private bigQueryClient: BigQuery;
  private readonly location = 'southamerica-east1';
  private readonly logger = new Logger(RowRepositoryService.name);

  constructor(
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

  // GET ROW SERVICE
  async getRows(board: BoardEntity): Promise<string[] | null> {
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

  //   UPDATE ROWS SERVICE
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

  //   CREATE ROWS SERVICE
  async insertRows(
    coreItems: any[],
    table: Table,
  ): Promise<TransferResponse | null> {
    return await this.insertRowsService.run(coreItems, table);
  }
}
