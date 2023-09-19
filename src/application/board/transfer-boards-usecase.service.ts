import { Injectable } from '@nestjs/common';
import { PrepareBoardsService } from './prepare-boards.service';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { PreparePayload } from './prepare-payload';

@Injectable()
export class TransferBoardsUsecase {
  private preparePayload = new PreparePayload();

  constructor(
    private bigQueryRepository: BigQueryRepository,
    private prepareBoardsService: PrepareBoardsService,
  ) {}

  async run() {
    // SETUP BOARDS COLUMNS AND TABLES FOR TO BIGQUERY SPECIFICATION
    const { boardTablePairs } = await this.prepareBoardsService.run();

    // INSERTING DATA
    const transferPromises = boardTablePairs.map(({ board, table }) => {
      const payload = this.preparePayload.run(board);

      return this.bigQueryRepository.transferDataToBoard(payload, table);
    });

    // WAITING FOR ALL THE INSERTIONS
    const responses = await Promise.all(transferPromises);
    console.log(responses);

    return responses;
  }
}
