import { PrismaBoardsRepository } from 'src/infra/database/boards-repository.service';
import { Board } from '../../domain/entities/board';
import { BoardFactory } from '../../domain/factory/board-factory;
import { GetBoardsService } from '../services/get-boards.service';
import { GetUseCase } from './get-usecase';

describe('Get Monday Boards', () => {
  it('should return the Monday boards"', async () => {
    // PREPARAÇÃO
    const factory = new BoardFactory();
    const repository = new PrismaBoardsRepository(factory);
    const getService = new GetBoardsService(repository);

    repository.items = [
      Board.create({
        name: 'teste',
        columns: [],
        groups: [],
        items: [],
      }),
    ];

    // EXECUÇÃO
    const transfer = new GetUseCase(getService);
    const response = await transfer.run();

    // RESULTADO
    expect(response).toEqual(repository.items);
  });

  it('should return null if no boards found', async () => {
    // Arrange
    const factory = new BoardFactory();
    const repository = new PrismaBoardsRepository(factory);
    const getService = new GetBoardsService(repository);

    const transfer = new GetUseCase(getService);

    // Act
    const response = await transfer.run();

    // Assert
    expect(response).toBeNull();
  });
});
