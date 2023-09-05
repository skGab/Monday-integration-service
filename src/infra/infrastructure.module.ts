import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

// INFRA
import { BoardsRepository } from './database/boards-repository';
import { MondayService } from './api/monday.service';
import { ApiService } from './api/api.service';

// DOMAIN
import { IBoardsRepository } from 'src/domain/database/iboards-repository';
import { BoardFactory, Factory } from 'src/domain/factory/board-factory';

@Module({
  // CONFIGURATION
  imports: [
    HttpModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
  ],

  // SERVICES
  providers: [
    {
      provide: ApiService,
      useClass: MondayService,
    },
    {
      provide: IBoardsRepository,
      useClass: BoardsRepository,
    },
    {
      provide: Factory,
      useClass: BoardFactory,
    },
  ],

  exports: [IBoardsRepository],
})
export class InfrastructureModule {}
