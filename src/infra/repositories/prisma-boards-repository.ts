import { BoardsRepository } from 'src/domain/repositories/boards-repository';
import { PrismaService } from '../database/prisma-client.service';
import { Board } from 'src/domain/entities/board';
import { BoardFactory } from 'src/domain/factory/board-factory';

export class PrismaBoardsRepository implements BoardsRepository {
  constructor(
    private prisma: PrismaService,
    private boardFactory: BoardFactory,
  ) {}

  async getAll(): Promise<Board[] | null> {
    const response = await this.prisma.board.findMany({
      include: {
        columns: true,
        groups: true,
      },
    });

    if (!response) {
      return null;
    }

    // Convert Prisma's response into Board instances
    return response.map((boardData) =>
      this.boardFactory.createBoard(boardData),
    );
  }

  // async getAll(): Promise<Board[] | null> {
  //   return;
  // }
}
