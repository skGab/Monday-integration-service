import { BigQuery } from '@google-cloud/bigquery';

@injectable()
export class CreateDatasetService {
  constructor(private readonly client: BigQuery) {}

  async run(name: string) {
    const [dataset] = await this.client.createDataset(name);
    return dataset;
  }
}
