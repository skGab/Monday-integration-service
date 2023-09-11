import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BigQuery } from '@google-cloud/bigquery';

// INFRA
import { BoardsRepositoryService } from './database/boards-repository.service';
import { MondayService } from './api/monday.service';
import { EventSenderService } from './error/event-sender.service';
import { CreateDatasetService } from './api/bigQuery/create-dataset.service';
import { BigQueryService } from './api/bigQuery/bigQuery.service';

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
    // WITHOUT CONTRACTS
    BigQuery,
    MondayService,
    BigQueryService,
    CreateDatasetService,
    EventSenderService,

    // WITH CONTRACTS
    {
      provide: BoardsRepository,
      useClass: BoardsRepositoryService,
    },
    {
      provide: Factory,
      useClass: BoardFactoryService,
    },
  ],

  exports: [BoardsRepository, BigQueryService],
})
export class InfrastructureModule {}
