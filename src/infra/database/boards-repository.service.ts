import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board';
import { BoardsRepository } from 'src/domain/database/boards-repository';
import { Factory } from 'src/domain/factory/board-factory.service';
import { MondayService } from '../api/monday.service';
import { Workspaces } from 'src/domain/factory/types';
import { BigQueryService } from '../api/bigQuery/bigQuery.service';

@Injectable()
export class BoardsRepositoryService implements BoardsRepository {
  constructor(
    private mondayService: MondayService,
    private boardFactoryService: Factory,
    private bigQueryService: BigQueryService,
  ) {}

  async getBoards(): Promise<Board[] | null> {
    const {
      data: { boards },
    } = await this.mondayService.run();

    if (!boards) {
      return null;
    }

    return boards.map((rawBoard) =>
      this.boardFactoryService.createBoard(rawBoard),
    );
  }

  async getWorkSpaces(): Promise<Workspaces[] | null> {
    const {
      data: { workspaces },
    } = await this.mondayService.run();

    if (!workspaces) {
      return null;
    }

    return workspaces;
  }

  async transferAll(boards: Board[]): Promise<Board[] | null> {
    const response = await this.bigQueryService.transfer(boards);

    if (!response) {
      return null;
    }

    return response;
  }
}
