import { Injectable } from '@nestjs/common';
import { MondayRepository } from 'src/domain/monday/monday-repository';
import { Payload } from 'src/domain/response/payload';

@Injectable()
export class FechBoardsService {
  constructor(private mondayRepositoryService: MondayRepository) {}

  async run(payload: Payload) {
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
