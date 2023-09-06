import { BoardDto } from '../dto/board.dto';
import { TransferBoardService } from './../services/transfer-boards.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferUseCase {
  constructor(private transferBoardsService: TransferBoardService) {}

  async run(): Promise<BoardDto[]> {
    const boards = await this.transferBoardsService.execute();
    return boards;
  }
}
