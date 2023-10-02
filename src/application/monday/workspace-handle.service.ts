import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import { MondayRepository } from 'src/domain/repository/monday-repository';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { DatasetVo } from 'src/domain/valueObjects/dataset.vo';

@Injectable()
export class WorkspaceHandleService {
  constructor(
    private bigQueryRepositoryService: BigQueryRepository,
    private mondayRepositoryService: MondayRepository,
  ) {}

  async run(): Promise<ServiceResponse<DatasetVo>> {
    // GET MONDAY WORKSPACES
    const mondayWorkSpaces = await this.mondayRepositoryService.getWorkSpaces();

    // CREATE THEM ON BIGQUERY
    const datasetInstancePromise = this.create(mondayWorkSpaces);

    // // UPDATE THE PAYLOAD
    // payload.addDataset(data);

    // payload.updateStatus({
    //   step: 'Criacao de Datasets',
    //   success: true,
    // });

    // Update payload in case of error
    // payload.updateStatus({
    //   step: 'Criacao de Datasets',
    //   success: false,
    //   error: error.message,
    // });

    return ResponseFactory.run(datasetInstancePromise);
  }

  private async create(mondayWorkSpaces: Workspace[]): Promise<DatasetVo> {
    // CREATE WORKSPACES ON BIGQUERY IF NOT EXISTS
    const bigQueryWorkspaces =
      await this.bigQueryRepositoryService.createDatasets(mondayWorkSpaces);

    const dataset = new DatasetVo(bigQueryWorkspaces);

    return dataset;
  }
}
