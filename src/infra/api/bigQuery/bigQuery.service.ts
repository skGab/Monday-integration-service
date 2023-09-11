import { BigQuery } from '@google-cloud/bigquery';
import { CreateDatasetService } from './create-dataset.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventSenderService } from 'src/infra/error/event-sender.service';
import { Workspaces } from 'src/domain/factory/types';
import credentials from '../../../../credentials/private.json';

@Injectable()
export class BigQueryService {
  readonly location = 'southamerica-east1';
  private bigQueryClient: BigQuery;

  constructor(
    private readonly createDatasetService: CreateDatasetService,
    private readonly configService: ConfigService,
    private readonly eventSenderService: EventSenderService,
  ) {
    this.bigQueryClient = new BigQuery({
      projectId: this.configService.get<string>('BIGQUERY_PROJECT_ID'),
      credentials: credentials,
    });
  }

  async datasetHandle(workspaces: Workspaces[]) {
    try {
      const promises = workspaces.map(async (workspace) => {
        this.createDatasetService.run(
          this.bigQueryClient,
          workspace.name,
          this.location,
        );
      });

      const dataset = await Promise.all(promises);

      return dataset;
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
