import { Injectable } from '@nestjs/common';
import { BoardDto } from '../dto/board.dto';
import { BoardsRepository } from 'src/domain/database/boards-repository';
import { Board } from 'src/domain/entities/board';

@Injectable()
export class TransferBoardService {
  constructor(private boardsRepositoryService: BoardsRepository) {}

  async execute(boards): Promise<BoardDto[]> {
    const response = await this.boardsRepositoryService.transferAll(boards);
    return response;
  }

  private toDto(board: Board): BoardDto {
    return {
      
    };
  }
}
