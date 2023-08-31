import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

// APPLICATION
import { BoardController } from './application/controllers/board.controller';
import { GetBoardsService } from './application/services/get-boards.service';
import { GetUseCase } from './application/usecases/get-usecase';
import { TransferUseCase } from './application/usecases/transfer-usecase';
import { ErrorHandlingService } from './application/services/error-handling.service';

// INFRA
import { BoardsRepository } from './infra/repositories/boards-repository';
import { MondayService } from './infra/api/monday.service';

// DOMAIN
import { IBoardsRepository } from './domain/repositories/iboards-repository';
import { Factory } from './domain/factory/factory';
import { BoardFactory } from './domain/factory/board-factory';

@Module({
  imports: [
    HttpModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [BoardController],
  providers: [
    GetBoardsService,
    GetUseCase,
    // TransferUseCase,
    MondayService,
    ErrorHandlingService,
    {
      provide: IBoardsRepository,
      useClass: BoardsRepository,
    },
  ],
})
export class AppModule {}
