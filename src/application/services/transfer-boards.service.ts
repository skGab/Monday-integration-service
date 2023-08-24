import { Injectable } from '@nestjs/common';
import { BoardsRepository } from 'src/domain/repositories/boards.repository';

@Injectable()
export class TransferBoardService {
  constructor(private boardsRepository: BoardsRepository, private dbClient) {}

  async execute() {
    const response = await this.boardsRepository.getAll();
    return response;
  }
}
