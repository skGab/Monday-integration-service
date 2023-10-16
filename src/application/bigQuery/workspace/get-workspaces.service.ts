import { Injectable } from '@nestjs/common';
import { Dataset } from '@google-cloud/bigquery';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';
import { DatasetRepository } from 'src/domain/repositories/bigQuery/dataset-repository';

@Injectable()
export class GetWorkspacesService {
  constructor(private datasetRepositoryService: DatasetRepository) {}

  async run(mondayWorkspaces: WorkspaceEntity[]): Promise<Dataset[]> {
    // GETTING DATASETS ON BIGQUERY FROM WORKSPACES
    const datasets = await this.datasetRepositoryService.getDatasets(
      mondayWorkspaces,
    );

    if (!datasets || datasets.length === 0) return null;

    return datasets;
  }
}
