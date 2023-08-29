import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { BoardController } from './application/controllers/board.controller';
// import { TransferBoards } from './application/usecases/transfer-usecase';
import { BoardsRepository } from './domain/repositories/iboards-repository';
import { PrismaService } from './infra/database/prisma-client.service';
import { PrismaBoardsRepository } from './infra/repositories/boards-repository';
import { GetBoardsService } from './application/services/get-boards.service';
import { GetUseCase } from './application/usecases/get-usecase';
import { TransferUseCase } from './application/usecases/transfer-usecase';

@Module({
  imports: [],
  controllers: [BoardController],
  providers: [
    GetBoardsService,
    GetUseCase,
    TransferUseCase,
    PrismaService,
    {
      provide: BoardsRepository,
      useClass: PrismaBoardsRepository,
    },
  ],
})
export class AppModule {}
