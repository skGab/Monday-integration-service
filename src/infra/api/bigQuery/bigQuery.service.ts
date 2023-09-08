import { CreateDatasetService } from './create-dataset.service';
import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateTableService } from './create-table.service';
import { Board } from 'src/domain/entities/board';
import { async } from 'rxjs';

export class BigQueryService {
  private readonly location = 'US';
  private readonly projectId = 'my_project';

  constructor(
    // private readonly httpService: HttpService,
    // private readonly eventEmitter: EventEmitter2,
    private readonly createDatasetService: CreateDatasetService,
    private readonly createTableService: CreateTableService,
  ) {}

  async run(boards: Board[], workspaces: any[], tables: any[]): Promise<any> {
    // Use map to create an array of promises for creating datasets
    const datasetPromises = workspaces.map(async (workspace) => {
      const datasetId = await this.createDatasetService.run(
        workspace.name,
        this.location,
      );

      // For each dataset, create tables
      const tablePromises = tables.map(async (table) => {
        return this.createTableService.run(
          workspace.name,
          table.name,
          this.location,
          boards,
        );
      });

      // Wait for all tables to be created for this dataset
      const tableIds = await Promise.all(tablePromises);

      return {
        datasetId: datasetId,
        tableIds: tableIds,
      };
    });

    // Wait for all datasets (and their respective tables) to be created
    const results = await Promise.all(datasetPromises);

    return results;
  }
}
