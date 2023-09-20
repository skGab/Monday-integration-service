import { PreparePayload } from './prepare-payload';
import { Injectable, Logger } from '@nestjs/common';
import { BigQuerySetupService } from '../bigQuery/bigQuery-setup.service';
import { MondayRepository } from 'src/domain/monday/monday-repository';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';

@Injectable()
export class PrepareBoardsService {
  private preparePayload: PreparePayload;

  constructor(
    private mondayRepositoryService: MondayRepository,
    private bigQuerySetupService: BigQuerySetupService,
    private bigQueryRepository: BigQueryRepository,
  ) {
    this.preparePayload = new PreparePayload();
  }

  async run() {
    // GETTING BOARDS FROM MONDAY
    const mondayBoards = await this.mondayRepositoryService.getBoards();

    // BIGQUERY BOARDS SETUP
    const { boardTablePairs } = await this.bigQuerySetupService.run(
      mondayBoards,
    );

    // INSERTING DATA
    const transferPromises = boardTablePairs.map(async ({ board, table }) => {
      // GET ITEMS FROM BIGQUERY
      const bigQueryItems = await this.bigQueryRepository.getItemsFromBoard(
        board,
      );

      // PREPARE DATA
      const { corePayload, duplicateItems } = this.preparePayload.run(
        bigQueryItems,
        board,
      );

      // MONDAY DOENST SEND UPDATES ABOUT THE FIELDS NAMES OF BOARDS, ITEMS, COLUMNS AND WORKSPACES
      // SO WILL HAVE TO THINK ABOUT SOME UPDATE IMPLEMENTATION

      // UPDATE BOARD ITEMS ON BIGQUERY
      if (duplicateItems.length !== 0) {
        const response = await this.bigQueryRepository.updateBoardItems(
          duplicateItems,
          board,
        );
        return response;
      }

      // TRANSFER UNIQUE DATA
      if (corePayload.length !== 0) {
        const response = await this.bigQueryRepository.transferItemsToBoard(
          corePayload,
          table,
        );
        return response;
      }

      return 'Dados já no bigquery';
    });

    return { transferPromises };
  }
}
