import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import { Dataset } from '@google-cloud/bigquery';

@Injectable()
export class GetWorkspacesService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(mondayWorkspaces: Workspace[]): Promise<Dataset[]> {
    // GETTING DATASETS ON BIGQUERY FROM WORKSPACES
    const datasets = await this.bigQueryRepositoryService.getDatasets(
      mondayWorkspaces,
    );

    if (!datasets) return null;

    return datasets;
  }
}
