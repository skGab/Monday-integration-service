import { BigQuery } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateDatasetService {
  async run(bigQuery: BigQuery, workspace: string, location: string) {
    const [dataset] = await bigQuery.createDataset(workspace, {
      location,
    });
    return dataset;
  }
}
