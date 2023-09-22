import { HandleBigQueryWorkspacesService } from './../workspace/handleBigQuery-workspaces.service';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { Injectable } from '@nestjs/common';
import { MondayRepository } from 'src/domain/monday/monday-repository';
import { PreparePayload } from './utils/prepare-payload';
import { BoardVo } from 'src/domain/board/board-vo';
import { SanitizeColumn } from './utils/sanitize-column';

@Injectable()
export class TransferBoardsUsecase {
  private preparePayload: PreparePayload;
  private sanitizeColumn: SanitizeColumn;

  constructor(
    private mondayRepositoryService: MondayRepository,
    private bigQueryRepositoryService: BigQueryRepository,
    private handleBigQueryWorkspacesService: HandleBigQueryWorkspacesService,
  ) {
    this.preparePayload = new PreparePayload();
    this.sanitizeColumn = new SanitizeColumn();
  }

  async run() {
    let payload = {
      bqTables: [],
      bqDatasets: [],
      mondayBoards: [],
      status: [],
    };

    try {
      // GET WORKSPACES FROM MONDAY
      const mondayWorkSpaces =
        await this.mondayRepositoryService.getWorkSpaces();

      // CREATE AND CHECK FOR WORKSPACES
      const bigQueryWorkspaces = await this.handleBigQueryWorkspacesService.run(
        mondayWorkSpaces,
      );
      payload.bqDatasets = bigQueryWorkspaces;

      console.log('--------------------------------------------');
      console.log('Workpaces do Monday já no BigQuery', bigQueryWorkspaces);
      console.log('--------------------------------------------');

      // GET BOARDS FROM MONDAY
      const mondayBoards = await this.mondayRepositoryService.getBoards();
      if (mondayBoards == null) return null;
      payload.mondayBoards = mondayBoards;

      console.log('--------------------------------------------');
      console.log('Quadros trazidos do Monday', mondayBoards);
      console.log('--------------------------------------------');

      // BIGQUERY BOARDS SETUP
      const { boardTablePairs } = await this.bigQuerySetup(mondayBoards);

      if (boardTablePairs === null) {
        throw new Error(
          `Algo deu errado durante a preparação de quadros e tabelas`,
        );
      }
      payload.bqTables = boardTablePairs.map((pair) => pair.table.id);

      console.log('--------------------------------------------');
      console.log('Quadros e tabelas alinhados', boardTablePairs);
      console.log('--------------------------------------------');

      // SETUP BOARDS COLUMNS AND TABLES FOR TO BIGQUERY SPECIFICATION
      const transferPromises = boardTablePairs.map(async (pair) =>
        this.prepareInsertion(pair),
      );

      const promisses = await Promise.all(transferPromises);
      payload.status = promisses.map((p) => p.status);

      // // // WAITING FOR ALL THE INSERTIONS
      console.log(payload);
      return payload;
    } catch (error) {
      throw new Error('Algo deu errado durante a transferencia');
    }
  }

  private async prepareInsertion({ board, table }) {
    // GET ITEMS FROM BIGQUERY
    const bigQueryItems =
      await this.bigQueryRepositoryService.getItemsFromBoard(board);

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
      const insertResult =
        await this.bigQueryRepositoryService.transferItemsToBoard(
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

  private async bigQuerySetup(mondayBoards: BoardVo[]) {
    // SANITIZING BOARDS COLUMNS
    const validBoards = this.sanitize(mondayBoards);

    // CREATE BOARDS ON BIGQUERY AND CREATE WORKSPACES IF NOT EXIST
    const bigQueryTables = await this.bigQueryRepositoryService.createBoards(
      validBoards,
    );

    if (bigQueryTables === null) {
      throw new Error(`Falha durante a busca/criação de tabelas/boards`);
    }

    // PREPARE BOARDS/TABLE TO INSERTION
    const boardTablePairs = validBoards.map((board, index) => ({
      board,
      table: bigQueryTables[index],
    }));

    return { boardTablePairs };
  }

  private sanitize(mondayBoards: BoardVo[]) {
    // FIXING MONDAY COLUMNS NAMES TO BIGQUERY ACCEPTANCE BOARDS
    const validBoards = mondayBoards.map((board) => {
      board.items = board.items.map((item) => {
        item.column_values = item.column_values.map((column) => {
          column.title = this.sanitizeColumn.run(column.title);
          return column;
        });
        return item;
      });
      return board;
    });
    return validBoards;
  }
}
