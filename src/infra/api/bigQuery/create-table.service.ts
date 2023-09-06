import { BigQuery } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CreateTableService {
  constructor(private readonly bigQuery: BigQuery) {}

  async run(workspaceId: string, table: string, location: string, boards) {
    const workspace = this.bigQuery.dataset(workspaceId);
    const destinationTable = workspace.table(table);

    const options = {
      query: boards,
      location: location,
      destination: destinationTable,
    };

    const [job] = await this.bigQuery.createQueryJob(options);
    return job;
  }
}
