import { Injectable } from '@nestjs/common';
import { BigQuerySetupService } from '../bigQuery/bigQuery-setup.service';
import { MondayRepository } from 'src/domain/monday/monday-repository';

@Injectable()
export class PrepareBoardsService {
  constructor(
    private mondayRepositoryService: MondayRepository,
    private bigQuerySetupService: BigQuerySetupService,
  ) {}

  async run() {
    // GETTING BOARDS FROM MONDAY
    const mondayBoards = await this.mondayRepositoryService.getBoards();

    // BIGQUERY BOARDS SETUP
    const { bigQueryTables, validBoards } = await this.bigQuerySetupService.run(
      mondayBoards,
    );

    // PREPARING PAYLOAD TO INSERTION
    const boardTablePairs = validBoards.map((board, index) => ({
      board,
      table: bigQueryTables[index],
    }));

    return { boardTablePairs };
  }
}
