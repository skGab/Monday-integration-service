import { TransferBoardService } from './../services/transfer-boards.service';
import { Injectable } from '@nestjs/common';
import { TransferBoardsDto } from '../dto/transfer-boards.dto';

@Injectable()
export class TransferUseCase {
  constructor(private transferBoardsService: TransferBoardService) {}

  async run(): Promise<TransferBoardsDto[]> {
    const boards = await this.transferBoardsService.execute();
    return boards;
  }
}
