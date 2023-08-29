import { TransferBoardService } from './../services/transfer-boards.service';
import { PrismaBoardsRepository } from 'src/infra/repositories/boards-repository';
import { Board } from '../../domain/entities/board';
import { BoardFactory } from 'src/domain/factory/board-factory';
import { GetBoardsService } from '../services/get-boards.service';
import { TransferUseCase } from './transfer-usecase';

describe('Transfer monday boards', () => {
  it('should return the transferred boards"', async () => {
    // PREPARAÇÃO
    const factory = new BoardFactory();
    const repository = new PrismaBoardsRepository(factory);
    const transferService = new TransferBoardService(repository);

    repository.items = [
      Board.create({
        name: 'teste',
        columns: [],
        groups: [],
        items: [],
      }),
    ];

    // EXECUÇÃO
    const transfer = new TransferUseCase(transferService);
    const response = await transfer.run();

    // RESULTADO
    expect(response).toEqual(repository.items);
  });

  it('should return null if no boards found', async () => {
    // Arrange
    const factory = new BoardFactory();
    const repository = new PrismaBoardsRepository(factory);
    const transferService = new TransferBoardService(repository);

    const transfer = new TransferUseCase(transferService);

    // Act
    const response = await transfer.run();

    // Assert
    expect(response).toBeNull();
  });
});
