import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';
import { DatasetVo } from 'src/domain/valueObjects/dataset.vo';

@Injectable()
export class CreateWorkspaceService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(
    mondayWorkSpaces: Workspace[],
  ): Promise<ServiceResponse<DatasetVo>> {
    // CREATE WORKSPACES ON BIGQUERY
    const datasetPromise = this.create(mondayWorkSpaces);

    return ResponseFactory.run(datasetPromise);
  }

  private async create(mondayWorkSpaces: Workspace[]): Promise<DatasetVo> {
    const response = await this.bigQueryRepositoryService.createDatasets(
      mondayWorkSpaces,
    );

    // GETTING NAMES FROM WORKSPACES
    const datasetsNames = response.map((dataset) => dataset.id);
    const datasetVo = new DatasetVo(datasetsNames);

    return datasetVo;
  }
}
