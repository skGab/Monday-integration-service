import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';

@Injectable()
export class GetDatasetsService {
  private readonly logger = new Logger(GetDatasetsService.name);

  async run(
    workspaces: WorkspaceEntity[],
    bigQueryClient: BigQuery,
  ): Promise<Dataset[] | null> {
    if (!workspaces) {
      this.logger.error('Nenhum board encontrado para a busca de items');
      return null;
    }

    // Map workspace IDs for quick lookup
    const workspaceIds = workspaces.map((workspace) => workspace.getId());

    // Fetch all datasets
    const [allDatasets] = await bigQueryClient.getDatasets();

    // Filter datasets based on workspace_id label
    const filteredDatasets = allDatasets.filter((dataset) => {
      return workspaceIds.includes(dataset.metadata.labels?.workspace_id);
    });

    return filteredDatasets;
  }
}
