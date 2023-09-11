import { BigQuery } from '@google-cloud/bigquery';
import { CreateDatasetService } from './create-dataset.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventSenderService } from 'src/infra/error/event-sender.service';
import { Workspaces } from 'src/domain/factory/types';

@Injectable()
export class BigQueryService {
  readonly location = 'US';
  private bigQueryClient: BigQuery;

  constructor(
    private readonly createDatasetService: CreateDatasetService,
    private readonly configService: ConfigService,
    private readonly eventSenderService: EventSenderService,
  ) {
    this.bigQueryClient = new BigQuery({
      projectId: this.configService.get<string>('BIGQUERY_PROJECT_ID'),
      keyFile: this.configService.get<string>('BIGQUERY_KEY_FILE'),
    });
  }

  async datasetHandle(workspaces: Workspaces[]) {
    try {
      const datasetId = workspaces.map(async (workspace) => {
        return await this.createDatasetService.run(
          this.bigQueryClient,
          workspace.name,
          this.location,
        );
      });
      console.log(datasetId);
      return datasetId;
    } catch (error) {
      this.eventSenderService.errorEvent(error, 'BigQuery Service');
    }
  }

  // async taleHandle(tables: any[]) {
  //   // For each dataset, create tables
  //   const tablePromises = tables.map(async (table) => {
  //     return this.createTableService.run(
  //       workspace.name,
  //       table.name,
  //       this.location,
  //       boards,
  //     );
  //   });

  //   // Wait for all tables to be created for this dataset
  //   const tableIds = await Promise.all(tablePromises);

  //   return tableIds;
  // }
}
