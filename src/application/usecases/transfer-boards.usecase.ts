import { Injectable } from '@nestjs/common';
import { GetBoardsService } from '../services/get-boards.service';

@Injectable()
export class TransferBoards {
  constructor(private getBoardsService: GetBoardsService) {}

  async run() {
    const response = await this.getBoardsService.execute();
    return response;
  }
}
