import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { BoardController } from './application/controllers/board.controller';
import { GetBoardsService } from './application/services/get-boards.service';
import { TransferBoards } from './application/usecases/transfer-boards.usecase';
import { BOARDS_REPOSITORY } from './domain/repositories/boards.repository';
import { InMemoryBoardsRepository } from 'tests/repositories/in-memory-boards-repository';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  controllers: [BoardController],
  providers: [
    GetBoardsService,
    TransferBoards,
    {
      provide: BOARDS_REPOSITORY, // Providing the interface
      useClass: InMemoryBoardsRepository, // Linking to the concrete implementation
    },
  ],
})
export class AppModule {}
