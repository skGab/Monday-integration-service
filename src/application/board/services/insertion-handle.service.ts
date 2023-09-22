import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { Injectable } from '@nestjs/common';
import { PreparePayload } from '../utils/prepare-payload';

@Injectable()
export class InsertionHandleService {
  private preparePayload: PreparePayload;

  constructor(private bigQueryRepositoryService: BigQueryRepository) {
    this.preparePayload = new PreparePayload();
  }

  async run(payload: any, bqTables: any[]) {
    try {
      const transferPromises = bqTables.map(async (table) =>
        this.setupColumnsAndTables(table),
      );
      const promises = await Promise.all(transferPromises);

      payload.status.push({
        step: 'SetupColumnsAndTables',
        success: true,
      });

      return { success: true, data: promises.map((p) => p.status) };
    } catch (error) {
      payload.status.push({
        step: 'SetupColumnsAndTables',
        success: false,
        error: error.message,
      });
      return { success: false };
    }
  }

  private async setupColumnsAndTables({ board, table }) {
    // GET ITEMS FROM BIGQUERY
    const bigQueryItems = await this.bigQueryRepositoryService.getRows(board);

    if (bigQueryItems === null) {
      throw new Error(`Failed to get items from BigQuery for board: ${board}`);
    }

    // PREPARE DATA TO BE INSERT OR UPDATE
    const { corePayload, duplicateItems } = this.preparePayload.run(
      bigQueryItems,
      board,
    );

    // UPDATE IMPLEMENTATION ON BIGQUERY
    if (duplicateItems.length !== 0) {
      // const updateResult =
      //   await this.bigQueryRepositoryService.updateBoardItems(
      //     duplicateItems,
      //     board,
      //   );

      // if (updateResult === null) {
      //   throw new Error(`Failed to update items for board: ${board}`);
      // }

      const response = duplicateItems.map((item) => item.solicitacao);

      console.log('--------------------------------------------');
      console.log(
        'Items da tabela',
        board.name,
        'já existentes no BigQuery',
        response,
      );
      console.log('--------------------------------------------');

      // return updateResult;
      return {
        status: `Items da tabela ${board.name} já existentes no BigQuery`,
        body: response,
      };
    } else {
      console.log('--------------------------------------------');
      console.log('Nenhum item para ser atualizado');
      console.log('--------------------------------------------');
    }

    // INSERT IMPLEMENTATION ON BIGQUERY
    if (corePayload.length !== 0) {
      const insertResult = await this.bigQueryRepositoryService.insertRows(
        corePayload,
        table,
      );

      if (insertResult === null) {
        throw new Error(`Failed to insert items for board: ${board}`);
      }

      return insertResult;
    } else {
      console.log('--------------------------------------------');
      console.log('Nenhum item novo para ser inserido');
      console.log('--------------------------------------------');
    }
  }
}
