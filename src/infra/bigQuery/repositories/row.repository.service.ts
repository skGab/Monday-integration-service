import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  InsertResponse,
  ItemsOperation,
} from 'src/application/dtos/bigQuery/item-job-status.dto';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { GetRowsService } from '../rows/get-rows.service';
import { InsertRowsService } from '../rows/insert-rows.service';
import { UpdateRowsService } from '../rows/update-rows.service';

import Credentials from '../../security/credentials.json';
import { RowRepository } from 'src/domain/repositories/bigQuery/row-repository';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import {
  ItemsEntity,
  Column_valueVo,
} from 'src/domain/entities/board/items-entity';

@Injectable()
export class RowRepositoryService implements RowRepository {
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
  ): Promise<InsertResponse | null> {
    try {
      const response = await this.updateRowsService.run(duplicateItems, table);

      return response;
    } catch (error) {
      throw error;
    }
  }

  //   CREATE ROWS SERVICE
  async createRows(
    mondayBoards: BoardEntity[],
  ): Promise<ItemsOperation[] | string> {
    try {
      const responses: ItemsOperation[] = [];

      for (const board of mondayBoards) {
        // PREPARE ITEMS FOR INSERTION
        const items = board.items_page.items.map(this.prepareSinglePayload);

        const response = await this.insertRowsService.run(
          items,
          this.bigQueryClient,
          board,
        );
        responses.push(response);
      }

      return responses;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  private prepareSinglePayload(items: ItemsEntity): {
    [key: string]: string;
  } {
    const payload: { [key: string]: string } = {};

    payload.nome = items.name;
    payload.grupo = items.group.title;

    items.column_values.forEach((column: Column_valueVo) => {
      payload[column.column.title] = column.text;
    });

    return payload;
  }
}
