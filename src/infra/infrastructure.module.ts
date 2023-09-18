import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BigQuery } from '@google-cloud/bigquery';

// INFRA
import { MondayService } from './monday/monday.service';
import { CreateDatasetService } from './bigQuery/util/create-dataset.service';
import { BigQueryService } from './bigQuery/bigQuery.service';
import { CreateTableService } from './bigQuery/util/create-table.service';
import { BigQueryRepositoryService } from './bigQuery/bigQuery-repository.service';
import { MondayRepositoryService } from './monday/monday-repository.service';

// DOMAIN
import { MondayRepository } from 'src/domain/monday/monday-repository';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';

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
