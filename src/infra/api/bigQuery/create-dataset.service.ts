import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateDatasetService {
  async run(
    bigQuery: BigQuery,
    workspace: string,
    location: string,
  ): Promise<Dataset> {
    const dataset = bigQuery.dataset(workspace);
    const [exists] = await dataset.exists();

    if (!exists) {
      const [dataset] = await bigQuery.createDataset(workspace, {
        location,
      });

      console.log('Tabela criada com sucesso', dataset.id);

      return dataset;
    }

    console.log('Tabelas já existente', dataset.id);
    return dataset;
  }
}
