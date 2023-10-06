import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import { DatasetDto } from 'src/application/bigQuery/dtos/dataset.dto';

@Injectable()
export class CreateWorkspaceService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(mondayWorkSpaces: Workspace[]): Promise<DatasetDto> {
    // CREATING DATASETS
    const datasets = await this.bigQueryRepositoryService.createDatasets(
      mondayWorkSpaces,
    );

    // CHECKING FOR EXISTENCE BEFORE CREATE THE DTO
    if (!datasets && datasets.length == 0) {
      return new DatasetDto(null, [], 0, 'Falha na criação de Datasets');
    }

    // GETTING NAMES FROM WORKSPACES
    return new DatasetDto(
      datasets,
      datasets.map((dataset) => dataset.id),
      datasets.length,
      'Success',
    );
  }
}
