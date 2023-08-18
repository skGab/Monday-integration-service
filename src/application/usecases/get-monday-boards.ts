import { Board } from 'src/domain/entities/board';
import { BoardsRepository } from 'src/domain/repositories/BoardsRepository';

type GetProps = {
  clientId: number;
};
export class GetMondayBoards {
  constructor(private boardsRepository: BoardsRepository) {}

  async execute({ clientId }: GetProps) {
    const response = await this.boardsRepository.findAll(clientId);
    const board = Board.create(response);

    return board;
  }
}
