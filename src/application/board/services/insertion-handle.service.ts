import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { Injectable } from '@nestjs/common';
import { PreparePayload } from '../utils/prepare-payload';
import { Payload } from 'src/domain/response/payload';
import { Board } from 'src/domain/board/entities/board';

@Injectable()
export class InsertionHandleService {
  private preparePayload: PreparePayload;

  constructor(private bigQueryRepositoryService: BigQueryRepository) {
    this.preparePayload = new PreparePayload();
  }

  async run(payload: Payload, boardTablePairs: any[]) {
    try {
      const transferPromises = boardTablePairs.map(async ({ board, table }) => {
        const { corePayload, duplicateItems } =
          await this.setupColumnsAndTables(board);

        return await this.transfer(corePayload, duplicateItems, board, table);
      });

      if (transferPromises === null) return null;

      const promises = await Promise.all(transferPromises);

      payload.updateStatus({
        step: 'InsertionService',
        success: true,
      });

      return { success: true, data: promises.map((p) => p.status) };
    } catch (error) {
      payload.updateStatus({
        step: 'SetupColumnsAndTables',
        success: false,
        error: error.message,
      });
      return { success: false };
    }
  }

  private async setupColumnsAndTables(board: Board) {
    // GET ITEMS FROM BIGQUERY
    const bigQueryItemsID = await this.bigQueryRepositoryService.getRows(board);

    if (bigQueryItemsID === null) return null;

    // PREPARE DATA TO BE INSERT OR UPDATE
    const { corePayload, duplicateItems } = this.preparePayload.run(
      bigQueryItemsID,
      board,
    );

    return { corePayload, duplicateItems };
  }

  private async transfer(
    duplicateItems: any[],
    corePayload: any[],
    board: Board,
    table: any,
  ) {
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

      const response = duplicateItems.map(
        (item: { solicitacao: any }) => item.solicitacao,
      );

      console.log('--------------------------------------------');
      console.log(
        'Items da tabela',
        board.getBoardName(),
        'já existentes no BigQuery',
        response,
      );
      console.log('--------------------------------------------');

      // return updateResult;
      return {
        status: `Items da tabela ${board.getBoardName()} já existentes no BigQuery`,
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

      if (insertResult === null) return null;

      return insertResult;
    } else {
      console.log('--------------------------------------------');
      console.log('Nenhum item novo para ser inserido');
      console.log('--------------------------------------------');
    }
  }
}
