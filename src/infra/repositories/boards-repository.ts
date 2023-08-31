import { Board } from 'src/domain/entities/board';
import { MondayService } from '../api/monday.service';
import { IBoardsRepository } from 'src/domain/repositories/iboards-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardsRepository implements IBoardsRepository {
  constructor(private mondayService: MondayService) {}

  async getAll(): Promise<Board[] | null> {
    const response = await this.mondayService.run();

    if (!response) {
      return null;
    }

    return response;
  }

  // async transferAll(): Promise<Board[] | null> {
  //   const response = await this.getAll();

  //   if (!response) {
  //     return null;
  //   }

  //   return;
  // }
}

