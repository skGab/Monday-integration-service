import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BigQuery } from '@google-cloud/bigquery';

// INFRA
import { ApiCallService } from './monday/api-call.service';
import { CreateDatasetService } from './bigQuery/dataset/create-dataset.service';
import { CreateTablesService } from './bigQuery/table/create-table.service';
import { MondayRepositoryService } from './monday/monday-repository.service';
import { GetRowsService } from './bigQuery/rows/get-rows.service';
import { UpdateRowsService } from './bigQuery/rows/update-rows.service';
import { CheckPlacesService } from './bigQuery/table/utils/check-places.service';
import { TableRepositoryService } from './bigQuery/repositories/table-repository.service';
import { RowRepositoryService } from './bigQuery/repositories/row.repository.service';
import { DatasetRepositoryService } from './bigQuery/repositories/dataset-repository.service';
import { InsertRowsService } from './bigQuery/rows/insert-rows.service';
import { GetDatasetsService } from './bigQuery/dataset/get-datasets.service';
import { GetTablesService } from './bigQuery/table/get-tables.service';

// DOMAIN
import { MondayRepository } from 'src/domain/repositories/monday-repository';
import { DatasetRepository } from 'src/domain/repositories/bigQuery/dataset-repository';
import { EntityFactory } from 'src/domain/factory/entity-factory';
import { ErrorDispatch } from '../domain/events/error-dispatch.events';
import { RowRepository } from 'src/domain/repositories/bigQuery/row-repository';
import { TableRepository } from 'src/domain/repositories/bigQuery/table-repository';
import { UpdateTablesService } from './bigQuery/table/update-tables.service';

@Module({
  // CONFIGURATION
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],

  // SERVICES
  providers: [
    BigQuery,

    // CRUD
    CreateDatasetService,
    CreateTablesService,
    InsertRowsService,
    GetRowsService,
    UpdateRowsService,
    GetDatasetsService,
    GetTablesService,
    UpdateTablesService,

    // UTIL SERVICES
    ApiCallService,
    CheckPlacesService,
    ErrorDispatch,
    EntityFactory,

    // CONTRACTS
    {
      provide: MondayRepository,
      useClass: MondayRepositoryService,
    },
    {
      provide: DatasetRepository,
      useClass: DatasetRepositoryService,
    },
    {
      provide: RowRepository,
      useClass: RowRepositoryService,
    },
    {
      provide: TableRepository,
      useClass: TableRepositoryService,
    },
  ],

  exports: [
    MondayRepository,
    DatasetRepository,
    RowRepository,
    TableRepository,
  ],
})
export class InfrastructureModule {}
