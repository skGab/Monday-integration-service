import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import { SharedShape } from 'src/application/dtos/bigQuery/dataset.dto';

@Injectable()
export class CreateWorkspaceService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(mondayWorkspaces: Workspace[]): Promise<SharedShape> {
    try {
      // FAST EXIST IF NO MONDAY BOARDS
      if (!mondayWorkspaces)
        return {
          names: null,
          count: 0,
          status: 'Nenhum workspace encontrado para criação de Datasets',
        };

      // CREATING DATASETS
      const datasets = await this.bigQueryRepositoryService.createDatasets(
        mondayWorkspaces,
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
