import { BoardsRepository } from 'src/domain/repositories/boards.repository';
import { PrismaService } from '../service/prisma-client.service';
import { Board } from 'src/domain/entities/board';

export class PrismaBoardsRepository implements BoardsRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Board[] | null> {
    const response = await this.prisma.board.findMany({
      include: {
        columns: true, // Include the columns relation
        groups: true, // Include the groups relation
      },
    });

    if (!response) {
      return null;
    }

    const boards = response.map((boardData) => {
      const items = JSON.parse(boardData.items);

      return Board.create(
        {
          name: boardData.name,
          columns: boardData.columns,
          groups: boardData.groups,
          items: items,
        },
        JSON.stringify(boardData.folderId),
      );
    });

    return boards;
  }
}
