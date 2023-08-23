import { Inject, Injectable } from '@nestjs/common';
import {
  BOARDS_REPOSITORY,
  BoardsRepository,
} from 'src/domain/repositories/boards.repository';

@Injectable()
export class GetBoardsService {
  constructor(
    @Inject(BOARDS_REPOSITORY)
    private boardsRepository: BoardsRepository,
  ) {}

  async execute() {
    const response = await this.boardsRepository.getAll();
    return response;
  }
}
