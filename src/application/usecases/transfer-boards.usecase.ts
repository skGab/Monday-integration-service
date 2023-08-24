import { Injectable } from '@nestjs/common';
import { TransferBoardService } from '../services/transfer-boards.service';

@Injectable()
export class TransferBoards {
  constructor(private transferBoardsService: TransferBoardService) {}

  async run() {
    const response = await this.transferBoardsService.execute();
    return response;
  }
}
