import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import { PayloadDto } from 'src/application/dto/payload.dto';
import { MondayRepository } from 'src/domain/repository/monday-repository';
import {
  ResponseFactory,
  ServiceResponse,
} from 'src/domain/factory/response-factory';

@Injectable()
export class CreateWorkspaces {
  constructor(
    private bigQueryRepositoryService: BigQueryRepository,
    private mondayRepositoryService: MondayRepository,
  ) {}

  async run(payload: PayloadDto): Promise<ServiceResponse<string[]>> {
    try {
      // GET MONDAY WORKSPACES
      const mondayWorkSpaces =
        await this.mondayRepositoryService.getWorkSpaces();

      // CREATE THEM ON BIGQUERY
      const data = await this.create(mondayWorkSpaces);

      // UPDATE THE PAYLOAD
      payload.addDataset(data);

      payload.updateStatus({
        step: 'Criação de Datasets',
        success: true,
      });

      return ResponseFactory.createSuccess(data);
    } catch (error) {
      // Update payload in case of error
      payload.updateStatus({
        step: 'Criação de Datasets',
        success: false,
        error: error.message,
      });

      return ResponseFactory.createFailure(error.messagee);
    }
  }

  private async create(mondayWorkSpaces: Workspace[]) {
    // CREATE WORKSPACES ON BIGQUERY IF NOT EXISTS
    const bigQueryWorkspaces =
      await this.bigQueryRepositoryService.createDatasets(mondayWorkSpaces);

    return bigQueryWorkspaces;
  }
}
