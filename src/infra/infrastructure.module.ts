import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BigQuery } from '@google-cloud/bigquery';

// INFRA
import { MondayService } from './api/monday.service';
import { CreateDatasetService } from './api/bigQuery/create-dataset.service';
import { BigQueryService } from './api/bigQuery/bigQuery.service';
import { CreateTableService } from './api/bigQuery/create-table.service';
import { BigQueryRepositoryService } from './database/bigQuery-repository.service';
import { MondayRepositoryService } from './database/monday-repository.service';

// DOMAIN
import { MondayRepository } from 'src/domain/database/monday-repository';
import { BigQueryRepository } from 'src/domain/database/bigQuery-repository';

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
    CreateTableService,

    // WITH CONTRACTS
    {
      provide: MondayRepository,
      useClass: MondayRepositoryService,
    },
    {
      provide: BigQueryRepository,
      useClass: BigQueryRepositoryService,
    },
  ],

  exports: [MondayRepository, BigQueryRepository],
})
export class InfrastructureModule {}
