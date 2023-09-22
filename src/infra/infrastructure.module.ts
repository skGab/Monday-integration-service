import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BigQuery } from '@google-cloud/bigquery';

// INFRA
import { CreateDatasetService } from './bigQuery/services/create-dataset.service';
import { CreateTableService } from './bigQuery/services/create-table.service';
import { BigQueryRepositoryService } from './bigQuery/bigQuery-repository.service';
import { MondayRepositoryService } from './monday/monday-repository.service';

// DOMAIN
import { MondayRepository } from 'src/domain/monday/monday-repository';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { CallApiService } from './monday/call-api.service';
import { TransferItemsService } from './bigQuery/services/transfer-items.service';
import { GetItemsService } from './bigQuery/services/get-items.service';
import { UpdateItemsService } from './bigQuery/services/update-items.service';

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
    CreateDatasetService,
    CreateTableService,
    CallApiService,
    TransferItemsService,
    GetItemsService,
    UpdateItemsService,

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
