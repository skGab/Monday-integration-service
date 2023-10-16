import { Injectable } from '@nestjs/common';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';
import { DatasetRepository } from 'src/domain/repositories/bigQuery/dataset-repository';

@Injectable()
export class CreateWorkspaceService {
  constructor(private datasetRepositoryService: DatasetRepository) {}

  async run(datasetsToCreate: WorkspaceEntity[]): Promise<SharedShape> {
    try {
      // FAST EXIST IF NO MONDAY BOARDS
      if (datasetsToCreate.length === 0 || !datasetsToCreate)
        return {
          names: null,
          count: 0,
          status: 'Não ha novas areas de trabalho para criação',
        };

      // CREATING DATASETS
      const datasets = await this.datasetRepositoryService.createDatasets(
        datasetsToCreate,
      );

      return {
        names: datasets,
        count: datasets.length,
        status: 'Success',
      };
    } catch (error) {
      return { names: null, count: 0, status: error };
    }
  }
}
