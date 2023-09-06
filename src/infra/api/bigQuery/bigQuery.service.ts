import { CreateDatasetService } from './create-dataset.service';
import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateTableService } from './create-table.service';

export class BigQueryService {
  private readonly location = 'US';
  private readonly projectId = 'my_project';

  constructor(
    // private readonly httpService: HttpService,
    // private readonly eventEmitter: EventEmitter2,
    private readonly createDatasetService: CreateDatasetService,
    private readonly createTableService: CreateTableService,
  ) {}

  async run(workspaceId: string, tableId: string, boards) {
    const workspace = await this.createDatasetService.run(
      workspaceId,
      this.location,
    );

    const table = await this.createTableService.run(
      workspaceId,
      tableId,
      this.location,
      boards,
    );
  }
}
