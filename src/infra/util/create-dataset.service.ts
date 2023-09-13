import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CreateDatasetService {
  logger = new Logger(CreateDatasetService.name);
  async run(
    bigQuery: BigQuery,
    workspace: string,
    location: string,
  ): Promise<Dataset> {
    try {
      const dataset = bigQuery.dataset(workspace);
      const [exists] = await dataset.exists();

      if (!exists) {
        const [dataset] = await bigQuery.createDataset(workspace, {
          location,
        });

        console.log('Novo WorkSpace criado:', dataset.id);
        return dataset;
      }

      return dataset;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
