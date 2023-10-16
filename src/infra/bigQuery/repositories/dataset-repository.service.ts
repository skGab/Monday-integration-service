import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';
import { CreateDatasetService } from '../dataset/create-dataset.service';
import { GetDatasetsService } from '../dataset/get-datasets.service';

import Credentials from '../../security/credentials.json';

@Injectable()
export class DatasetRepositoryService {
  private bigQueryClient: BigQuery;
  private readonly location = 'southamerica-east1';
  private readonly logger = new Logger(DatasetRepositoryService.name);

  constructor(
    private readonly createDatasetService: CreateDatasetService,
    private readonly getDatasetsService: GetDatasetsService,
    private readonly configService: ConfigService,
  ) {
    this.bigQueryClient = new BigQuery({
      projectId: this.configService.get<string>('BIGQUERY_PROJECT_ID'),
      credentials: Credentials,
    });
  }
  // CREATE DATASETS SERVICE
  async createDatasets(datasetsToCreate: WorkspaceEntity[]): Promise<string[]> {
    const promises = datasetsToCreate.map(async (workspace) => {
      return await this.createDatasetService.create(
        this.location,
        this.bigQueryClient,
        workspace,
      );
    });

    const responses = await Promise.allSettled(promises);

    // Extract the result from each settled promise
    const datasetsIds: string[] = responses.map((response) =>
      response.status === 'fulfilled'
        ? `Disponivel: ${response.value}`
        : response.reason,
    );

    return datasetsIds;
  }

  //   GET DATASETS SERVICE
  async getDatasets(workspaces: WorkspaceEntity[]): Promise<Dataset[] | null> {
    if (!workspaces) {
      this.logger.error(
        'Nenhuma area encontrado para busca de Datasets no BigQuery',
      );
      return null;
    }

    const datasets = await this.getDatasetsService.run(
      workspaces,
      this.bigQueryClient,
    );

    return datasets;
  }
}
