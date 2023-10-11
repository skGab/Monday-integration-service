import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import { SharedShape } from 'src/application/dtos/bigQuery/dataset.dto';
import { Dataset } from '@google-cloud/bigquery';

@Injectable()
export class UpdateWorkspaceService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(datasetsToUpdate: Workspace[]): Promise<SharedShape> {
    try {
      // FAST EXIST IF NO MONDAY BOARDS
      if (!datasetsToUpdate)
        return {
          names: null,
          count: 0,
          status: 'Nenhum workspace encontrado para criação de Datasets',
        };

      // CREATING DATASETS
      const updatedDatasets =
        await this.bigQueryRepositoryService.updateDatasets(datasetsToUpdate);

      if (!updatedDatasets)
        return {
          names: null,
          count: 0,
          status: 'Falha na atualização de Datasets',
        };

      return {
        names: updatedDatasets.map((dataset) => dataset.id),
        count: updatedDatasets.length,
        status: 'Success',
      };
    } catch (error) {
      return { names: null, count: 0, status: error };
    }
  }
}
