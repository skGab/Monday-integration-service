import { Board } from 'src/domain/entities/board';
import { BoardsRepository } from 'src/domain/repositories/boards.repository';
import { PrismaService } from '../service/prisma-client.service';

export class PrismaBoardsRepository implements BoardsRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Board[] | null> {
    const response = await this.prisma.board.findMany();

    const boards = response.map(board => {
      const
    });
    // if (!response) {
    //   return null;
    // }

    return boards;
  }
}
