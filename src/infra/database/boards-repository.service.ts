import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board';
import { BoardsRepository } from 'src/domain/database/boards-repository';
import { Factory } from 'src/domain/factory/board-factory.service';
import { MondayService } from '../api/monday.service';
import { BigQueryService } from '../api/bigQuery/bigQuery.service';
import { BoardDto } from 'src/application/dto/board.dto';

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

  async transferAll(
    workspaceId: string,
    tableId: string,
    boards,
  ): Promise<BoardDto[] | null> {
    const response = await this.bigQueryService.run(
      workspaceId,
      tableId,
      boards,
    );

    // if (!response) {
    //   return null;
    // }

    return;
  }
}
