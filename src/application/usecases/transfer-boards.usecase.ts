import { Injectable } from '@nestjs/common';
import { TransferBoardService } from '../services/transfer-boards.service';
import { GetBoardsDto } from '../dto/get-boards.dto';

@Injectable()
export class TransferBoards {
  constructor(private transferBoardsService: TransferBoardService) {}

  async run(): Promise<GetBoardsDto[]> {
    const response = await this.transferBoardsService.execute();
    return response;
  }
}
