import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BigQuery } from '@google-cloud/bigquery';

// INFRA
import { ApiCallService } from './monday/api/api-call.service';
import { CreateDatasetService } from './bigQuery/create-dataset.service';
import { CreateTableService } from './bigQuery/table/create-table.service';
import { BigQueryRepositoryService } from './bigQuery/repository/bigQuery-repository.service';
import { MondayRepositoryService } from './monday/repository/monday-repository.service';
import { TransferRowsService } from './bigQuery/rows/transfer-rows.service';
import { GetRowsService } from './bigQuery/rows/get-rows.service';
import { UpdateRowsService } from './bigQuery/rows/update-rows.service';
import { CheckPlacesService } from './bigQuery/table/check-places.service';

// DOMAIN
import { MondayRepository } from 'src/domain/repository/monday-repository';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';

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
    ApiCallService,
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
