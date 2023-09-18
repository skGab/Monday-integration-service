import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { PrepareItemsService } from './utils/prepare-items.service';
import { SanitizeColumnService } from './utils/sanitize-column.service';
import { MondayRepository } from 'src/domain/monday/monday-repository';

@Injectable()
export class TransferBoardsUsecase {
  constructor(
    private mondayRepositoryService: MondayRepository,
    private bigQueryRepository: BigQueryRepository,
    private prepareItemsService: PrepareItemsService,
    private sanitizeColumnService: SanitizeColumnService,
  ) {}

  async run() {
    // GET MONDAY BOARDS
    const mondayBoards = await this.mondayRepositoryService.getBoards();

    // FIXING MONDAY COLUMNS NAMES TO BIGQUERY ACCEPTANCE BOARDS
    const sanitizedMondayBoards = mondayBoards.map((board) => {
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
    // HERE IM CREATING THE BOARDS/TABLES AND CREATING THE WORKSPACES/DATASETS IF NOT EXISTS
    // THE CREATION OF BOARDS/TABLES SHOULD BE DINAMIC ON BIGQUERY, BECAUSE THE BOARDS COLUMNS ARE FLEXIVE
    // THE CREATION OF WORKSPACES/DATASETS SHOULD BE A PART, BECAUSE THE NAMES ARE MORE EASILY TO UPDATE
    const bigQueryBoards = await this.bigQueryRepository.createBoards(
      sanitizedMondayBoards,
    );

    //  MAPPING ITEMS TO BIGQUERY SCHEMA
    const bigQueryItems = sanitizedMondayBoards.map((board) =>
      this.prepareItemsService.run(board.items),
    );

    // TRANSFER BOARDS TO BIGQUERY
    // const response = this.bigQueryRepository.transferBoards(
    //   bigQueryItems,
    //   bigQueryBoards,
    // );

    console.log(bigQueryItems);

    return bigQueryItems;
  }
}
