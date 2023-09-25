import { Injectable } from '@nestjs/common';
import { PayloadDto } from 'src/application/dto/payload.dto';
import { MondayRepository } from 'src/domain/repository/monday-repository';

@Injectable()
export class FetchBoardsService {
  constructor(private mondayRepositoryService: MondayRepository) {}

  async run(payload: PayloadDto) {
    try {
      const mondayBoards = await this.mondayRepositoryService.getBoards();

      if (mondayBoards === null) {
        payload.updateStatus({
          step: 'FetchBoards',
          success: false,
          error: 'No Monday boards found',
        });
        return { success: false };
      }

      payload.addBoard(mondayBoards);

      payload.updateStatus({
        step: 'FetchBoards',
        success: true,
      });

      return { success: true, data: mondayBoards };
    } catch (error) {
      payload.updateStatus({
        step: 'FetchBoards',
        success: false,
        error: error.message,
      });
      return { success: false };
    }
  }
}
