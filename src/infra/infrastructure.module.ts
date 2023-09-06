import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

// INFRA
import { BoardsRepositoryService } from './database/boards-repository.service';
import { MondayService } from './api/monday.service';
import { ApiService } from './api/api.service';

// DOMAIN
import { BoardsRepository } from 'src/domain/database/boards-repository';
import {
  BoardFactoryService,
  Factory,
} from 'src/domain/factory/board-factory.service';

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
      provide: BoardsRepository,
      useClass: BoardsRepositoryService,
    },
    {
      provide: Factory,
      useClass: BoardFactoryService,
    },
  ],

  exports: [BoardsRepository],
})
export class InfrastructureModule {}
