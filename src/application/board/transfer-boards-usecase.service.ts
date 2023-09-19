import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { PrepareItemsService } from './utils/prepare-items.service';
import { SanitizeColumnService } from './utils/sanitize-column.service';
import { MondayRepository } from 'src/domain/monday/monday-repository';
import { BoardVo } from 'src/domain/board/board-vo';

@Injectable()
export class TransferBoardsUsecase {
  constructor(
    private mondayRepositoryService: MondayRepository,
    private bigQueryRepository: BigQueryRepository,
    private sanitizeColumnService: SanitizeColumnService,
  ) {}

  async run() {
    // BIGQUERY BOARDS SETUP
    const { bigQueryTables, validBoards } = await this.bigQuerySetup();

    // PREPARING PAYLOAD TO INSERTION
    const boardTablePairs = validBoards.map((board, index) => ({
      board,
      table: bigQueryTables[index],
    }));

    const transferPromises = boardTablePairs.map(({ board, table }) => {
      const payload = this.preparePayloadForBoard(board); // Note: This function prepares a payload for a single board
      return this.bigQueryRepository.transferDataToBoard(payload, table); // Note: Change the method name to singular
    });

    const responses = await Promise.all(transferPromises);

    console.log(responses);

    return responses;
  }

  async bigQuerySetup() {
    // GET MONDAY BOARDS
    const mondayBoards = await this.mondayRepositoryService.getBoards();

    // FIXING MONDAY COLUMNS NAMES TO BIGQUERY ACCEPTANCE BOARDS
    const validBoards = mondayBoards.map((board) => {
      board.items = board.items.map((item) => {
        item.column_values = item.column_values.map((column) => {
          column.title = this.sanitizeColumnService.run(column.title);
          return column;
        });
        return item;
      });
      return board;
    });

    // CREATE BOARDS ON BIGQUERY
    const bigQueryTables = await this.bigQueryRepository.createBoards(
      validBoards,
    );
    return { bigQueryTables, validBoards };
  }

  preparePayloadForBoard(board: BoardVo): any {
    return board.items.map((item) => {
      const payload: { [key: string]: string } = {};

      payload.solicitacao = item.name;
      payload.grupo = item.group.title;

      item.column_values.forEach((column) => {
        payload[column.title] = column.text;
      });

      return payload;
    });
  }
}

//  MAPPING ITEMS TO BIGQUERY SCHEMA
// const bigQueryItems = sanitizedMondayBoards.map((board) =>
//   this.prepareItemsService.run(board.items),
// );

// const rows = Array.isArray(bigQueryItems[0])
//   ? bigQueryItems[0]
//   : bigQueryItems;
