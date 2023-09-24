import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BigQuery } from '@google-cloud/bigquery';

// INFRA
import { CallApiService } from './monday/call-api.service';
import { CreateDatasetService } from './bigQuery/services/create-dataset.service';
import { CreateTableService } from './bigQuery/table/create-table.service';
import { BigQueryRepositoryService } from './bigQuery/bigQuery-repository.service';
import { MondayRepositoryService } from './monday/monday-repository.service';
import { TransferRowsService } from './bigQuery/services/transfer-rows.service';
import { GetRowsService } from './bigQuery/services/get-rows.service';
import { UpdateRowsService } from './bigQuery/services/update-rows.service';
import { CheckPlacesService } from './bigQuery/table/check-places.service';

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
    BigQuery,

    // CRUD
    CreateDatasetService,
    CreateTableService,
    TransferRowsService,
    GetRowsService,
    UpdateRowsService,

    // UTIL SERVICES
    CallApiService,
    CheckPlacesService,

    // CONTRACTS
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
