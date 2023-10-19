import { Dataset } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';
import { DatasetRepository } from 'src/domain/repositories/bigQuery/dataset-repository';

type Response = {
  avaliableDatasets: string[] | string;
};

@Injectable()
export class CreateWorkspaceService {
  constructor(private datasetRepositoryService: DatasetRepository) {}

  async run(datasetsToCreate: WorkspaceEntity[]): Promise<Response> {
    try {
      // FAST EXIST IF NO MONDAY BOARDS
      if (!datasetsToCreate) {
        return {
          avaliableDatasets:
            'Não foram encontrados areas de trabalho para criação',
        };
      }

      // CREATING DATASETS
      const datasets = await this.datasetRepositoryService.createDatasets(
        datasetsToCreate,
      );

      return {
        avaliableDatasets: datasets,
      };
    } catch (error) {
      return {
        avaliableDatasets: error.message,
      };
    }
  }
}
