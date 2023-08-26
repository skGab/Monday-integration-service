import { InMemoryBoardsRepository } from '../../../tests/repositories/in-memory-boards-repository';
import { Board } from '../../domain/entities/board';
import { GetBoardsService } from '../services/transfer-boards.service';
import { TransferBoards } from './transfer-usecase';

describe('Transfer monday boards', () => {
  it('should return the transferred boards"', async () => {
    // PREPARAÇÃO
    const repository = new InMemoryBoardsRepository();
    const getService = new GetBoardsService(repository);

    const board = Board.create({
      name: 'teste',
      columns: [],
      groups: [],
      items: [],
    });
    repository.items.push(board);

    // EXECUÇÃO
    const transfer = new TransferBoards(getService);
    const response = await transfer.run();

    // RESULTADO
    expect(response).toEqual(repository.items);
  });

  it('should return null if no boards found', async () => {
    // Arrange
    const repository = new InMemoryBoardsRepository();
    const getService = new GetBoardsService(repository);

    const transfer = new TransferBoards(getService);

    // Act
    const response = await transfer.run();

    // Assert
    expect(response).toBeNull();
  });
});
