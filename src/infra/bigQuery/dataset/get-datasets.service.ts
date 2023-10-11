import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { Workspace } from 'src/domain/entities/board/workspace';

@Injectable()
export class GetDatasetsService {
  private readonly logger = new Logger(GetDatasetsService.name);

  async run(
    workspaces: Workspace[],
    bigQueryClient: BigQuery,
  ): Promise<Dataset[] | null> {
    if (!workspaces) {
      this.logger.error('Nenhum board encontrado para a busca de items');
      return null;
    }

    const datasets: Dataset[] = [];

    for (const workspace of workspaces) {
      const datasetId = workspace.name; // Assuming dataset IDs correspond to workspace names
      const dataset = bigQueryClient.dataset(datasetId);

      // Check if dataset exists
      const [exists] = await dataset.exists();

      if (exists) {
        datasets.push(dataset);
      }
    }

    return datasets;
  }
}
