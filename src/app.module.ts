import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { BoardController } from './application/controllers/board.controller';
// import { TransferBoards } from './application/usecases/transfer-usecase';
import { BoardsRepository } from './domain/repositories/boards-repository';
import { PrismaService } from './infra/database/prisma-client.service';
import { PrismaBoardsRepository } from './infra/repositories/prisma-boards-repository';
import { GetBoardsService } from './application/services/get-boards.service';
import { GetUseCase } from './application/usecases/get-usecase';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  controllers: [BoardController],
  providers: [
    GetBoardsService,
    GetUseCase,
    // TransferBoards,
    PrismaService,

    {
      provide: BoardsRepository, // Providing the interface
      useClass: PrismaBoardsRepository, // Linking to the concrete implementation
    },
  ],
})
export class AppModule {}
