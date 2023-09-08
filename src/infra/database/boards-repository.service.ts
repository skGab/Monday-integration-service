import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board';
import { BoardsRepository } from 'src/domain/database/boards-repository';
import { Factory } from 'src/domain/factory/board-factory.service';
import { MondayService } from '../api/monday.service';
import { BigQueryService } from '../api/bigQuery/bigQuery.service';

@Injectable()
export class BoardsRepositoryService implements BoardsRepository {
  constructor(
    private mondayService: MondayService,
    private boardFactoryService: Factory,
    private bigQueryService: BigQueryService,
  ) {}

  async getAll(): Promise<Board[] | null> {
    const {
      data: { boards },
    } = await this.mondayService.run();

    if (!boards) {
      return null;
    }

    console.log(boards);

    return boards.map((rawBoard) =>
      this.boardFactoryService.createBoard(rawBoard),
    );
  }

  async transferAll(boards: Board[]): Promise<Board[] | null> {
    const response = await this.bigQueryService.run(boards);

    if (!response) {
      return null;
    }

    return response;
  }
}
