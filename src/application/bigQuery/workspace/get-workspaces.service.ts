import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Dataset } from '@google-cloud/bigquery';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';

@Injectable()
export class GetWorkspacesService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(mondayWorkspaces: WorkspaceEntity[]): Promise<Dataset[]> {
    // GETTING DATASETS ON BIGQUERY FROM WORKSPACES
    const datasets = await this.bigQueryRepositoryService.getDatasets(
      mondayWorkspaces,
    );

    if (!datasets) return null;

    return datasets;
  }
}
