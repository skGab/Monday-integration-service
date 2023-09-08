import { Board } from 'src/domain/entities/board';
import { BoardDto } from '../dto/board.dto';
import { TransferBoardService } from './../services/transfer-boards.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferUseCase {
  constructor(private transferBoardsService: TransferBoardService) {}

  async run(boards: Board[]): Promise<BoardDto[]> {
    const response = await this.transferBoardsService.execute(boards);
    return response;
  }
}
