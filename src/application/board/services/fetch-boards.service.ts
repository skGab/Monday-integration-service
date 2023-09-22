import { Injectable } from '@nestjs/common';
import { MondayRepository } from 'src/domain/monday/monday-repository';

@Injectable()
export class FechBoardsService {
  constructor(private mondayRepositoryService: MondayRepository) {}

  async run(payload: any) {
    try {
      const mondayBoards = await this.mondayRepositoryService.getBoards();

      if (mondayBoards === null) {
        payload.status.push({
          step: 'FetchBoards',
          success: false,
          error: 'No Monday boards found',
        });
        return { success: false };
      }

      payload.mondayBoards = mondayBoards;

      payload.status.push({
        step: 'FetchBoards',
        success: true,
      });

      return { success: true, data: mondayBoards };
    } catch (error) {
      payload.status.push({
        step: 'FetchBoards',
        success: false,
        error: error.message,
      });
      return { success: false };
    }
  }
}
