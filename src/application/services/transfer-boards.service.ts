import { Injectable } from '@nestjs/common';
import { BoardDto } from '../dto/board.dto';
import { BoardsRepository } from 'src/domain/database/boards-repository';
import { Board } from 'src/domain/entities/board';

@Injectable()
export class TransferBoardService {
  constructor(private boardsRepository: BoardsRepository) {}

  async execute(boards): Promise<BoardDto[]> {
    const response = await this.boardsRepository.transferAll();
    // return boards.map((board) => this.toDto(board));
  }

  // private toDto(board: Board): BoardDto {
  //   return {};
  // }
}
