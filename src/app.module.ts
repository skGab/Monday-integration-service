import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { BoardController } from './application/controllers/board.controller';
import { TransferBoardService } from './application/services/transfer-boards.service';
import { TransferBoards } from './application/usecases/transfer-boards.usecase';
import { BoardsRepository } from './domain/repositories/boards.repository';
import { PrismaService } from './infra/service/prisma-client.service';
import { PrismaBoardsRepository } from './infra/repositories/prisma-boards.repository';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  controllers: [BoardController],
  providers: [
    TransferBoardService,
    TransferBoards,
    PrismaService,

    {
      provide: BoardsRepository, // Providing the interface
      useClass: PrismaBoardsRepository, // Linking to the concrete implementation
    },
  ],
})
export class AppModule {}
