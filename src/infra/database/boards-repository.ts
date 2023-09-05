import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board';
import { IBoardsRepository } from 'src/domain/database/iboards-repository';
import { Factory } from 'src/domain/factory/board-factory';
import { ApiService } from '../api/api.service';

@Injectable()
export class BoardsRepository implements IBoardsRepository {
  constructor(
    private mondayService: ApiService,
    private boardFactory: Factory,
  ) {}

  async getAll(): Promise<Board[] | null> {
    const response = await this.mondayService.run();

    if (!response) {
      return null;
    }

    return response.map((rawBoard) => this.boardFactory.createBoard(rawBoard));
  }

  // async transferAll(): Promise<Board[] | null> {
  //   const response = await this.getAll();

  //   if (!response) {
  //     return null;
  //   }

  //   return;
  // }
}
