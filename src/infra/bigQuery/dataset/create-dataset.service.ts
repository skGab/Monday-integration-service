import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';

@Injectable()
export class CreateDatasetService {
  private readonly logger = new Logger(CreateDatasetService.name);

  async create(
    location: string,
    bigQuery: BigQuery,
    workspace: WorkspaceEntity,
  ): Promise<Dataset> {
    const dataset = bigQuery.dataset(workspace.name);
    const [exists] = await dataset.exists();

    if (!exists) {
      const [newDataset] = await bigQuery.createDataset(
        workspace.name,
        {
          labels: { workspace_id: workspace.getId().toString() },
          location: location,
        },
      );

      console.log('Novo Dataset criado:', newDataset.id);
      return newDataset;
    }

    console.log('Dataset Existente:', dataset.id);

    return dataset;
  }
}
