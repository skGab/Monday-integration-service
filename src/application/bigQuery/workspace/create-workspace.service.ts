import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';

@Injectable()
export class CreateWorkspaceService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(datasetsToCreate: WorkspaceEntity[]): Promise<SharedShape> {
    try {
      // FAST EXIST IF NO MONDAY BOARDS
      if (datasetsToCreate.length === 0 || !datasetsToCreate)
        return {
          names: null,
          count: 0,
          status: 'Não ha novos datasets para criação',
        };

      // CREATING DATASETS
      const datasets = await this.bigQueryRepositoryService.createDatasets(
        datasetsToCreate,
      );

      if (!datasets)
        return {
          names: null,
          count: 0,
          status: 'Falha na criação de Datasets',
        };

      return {
        names: datasets.map((dataset) => dataset.id),
        count: datasets.length,
        status: 'Success',
      };
    } catch (error) {
      return { names: null, count: 0, status: error };
    }
  }
}
