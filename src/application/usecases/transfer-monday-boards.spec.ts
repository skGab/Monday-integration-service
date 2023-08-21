import { Board } from '../../domain/entities/board';
import { TransferMondayBoards } from './transfer-monday-boards';
import { InMemoryBoardsRepository } from '../../../test/repositories/in-memory-boards-repository';

describe('Transfer monday boards', () => {
  it('should return the transferred boards"', async () => {
    const boardsRepository = new InMemoryBoardsRepository();

    const board = Board.create({
      name: 'teste',
      columns: [],
      groups: [],
      items: []
    });

    boardsRepository.items.push(board)

    const systemUnderTest = new TransferMondayBoards(boardsRepository);

    const response = await systemUnderTest.execute();

    expect(response).toBeTruthy();
  });
});
