import { Injectable } from '@nestjs/common';
import { GetBoardsService } from '../services/get-boards.service';
import { Board } from 'src/domain/entities/board';

@Injectable()
export class GetUseCase {
  constructor(private getBoardsService: GetBoardsService) {}

  async run(): Promise<Board[]> {
    const boards = await this.getBoardsService.execute();
    return boards;
  }
}
