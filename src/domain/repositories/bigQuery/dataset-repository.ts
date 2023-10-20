import { Dataset } from '@google-cloud/bigquery';
import { WorkspaceEntity } from '../../entities/board/workspace-entity';

export abstract class DatasetRepository {
  // GET DATASETS
  abstract getDatasets(
    workspaces: WorkspaceEntity[],
  ): Promise<Dataset[] | null>;

  // CREATE DATASETS
  abstract createDatasets(
    datasetsToCreate: WorkspaceEntity[],
  ): Promise<string[]>;
}
