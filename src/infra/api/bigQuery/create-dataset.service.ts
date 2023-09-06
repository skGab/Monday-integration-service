import { BigQuery } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateDatasetService {
  constructor(private readonly bigQuery: BigQuery) {}

  async run(workspace: string, location: string) {
    const [dataset] = await this.bigQuery.createDataset(workspace, {
      location,
    });
    return dataset;
  }
}
