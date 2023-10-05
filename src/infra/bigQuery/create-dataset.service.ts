import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CreateDatasetService {
  private readonly logger = new Logger(CreateDatasetService.name);

  async run(
    location: string,
    bigQuery: BigQuery,
    workspaceName: string,
  ): Promise<Dataset> {
    const dataset = bigQuery.dataset(workspaceName);
    const [exists] = await dataset.exists();

    if (!exists) {
      const [newDataset] = await bigQuery.createDataset(workspaceName, {
        location: location,
      });

      console.log('Novo Dataset criado:', newDataset.id);
      return newDataset;
    }

    return dataset;
  }
}
