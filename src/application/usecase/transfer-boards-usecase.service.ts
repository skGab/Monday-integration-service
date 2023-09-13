import { SanitizeColumnService } from './../services/sanitize-column.service';
import { WorkSpacesValidator } from '../services/workSpaces-validator.service';
import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/database/bigQuery-repository';
import { MondayRepository } from 'src/domain/database/monday-repository';
import { PrepareItemsService } from '../services/prepare-items.service';

@Injectable()
export class TransferBoardsUsecase {
  constructor(
    private mondayRepositoryService: MondayRepository,
    private bigQueryRepository: BigQueryRepository,
    private workSpacesValidator: WorkSpacesValidator,
    private prepareItemsService: PrepareItemsService,
    private sanitizeColumnService: SanitizeColumnService,
  ) {}

  async createBigQueryWorkSpaces() {
    // GET WORKSPACES
    const mondayWorkSpaces = await this.mondayRepositoryService.getWorkSpaces();

    // VALIDATE
    const validWorkspaces = this.workSpacesValidator.validate(mondayWorkSpaces);

    // CREATE WORKSPACES ON BIGQUERY
    const bigQueryWorkspaces = await this.bigQueryRepository.createWorkspaces(
      validWorkspaces,
    );

    return bigQueryWorkspaces;
  }

  async run() {
    // GET BOARDS
    const mondayBoards = await this.mondayRepositoryService.getBoards();

    // SANITIZE MONDAY BOARDS
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
    const bigQueryBoards = await this.bigQueryRepository.createBoards(
      sanitizedMondayBoards,
    );

    // VALIDATE ITEMS TO BIGQUERY SCHEMA
    const bigQueryItems = sanitizedMondayBoards.map((board) =>
      this.prepareItemsService.run(board.items),
    );

    // TRANSFER BOARDS TO BIGQUERY
    // const response = this.bigQueryRepository.transferBoards(
    //   bigQueryItems,
    //   bigQueryBoards,
    // );

    console.log(response);
    return response;
  }
}
