import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board';
import { BoardsRepository } from '../../domain/database/boards-repository';

@Injectable()
export class GetBoardsService {
  constructor(private boardsRepositoryService: BoardsRepository) {}

  async run(): Promise<Board[]> {
    const boards = await this.boardsRepositoryService.getAll();
    return boards;
  }
}
