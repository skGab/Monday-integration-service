import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { WorkSpaceNameValidator } from '../../utils/workspaceName-validator';
import { Workspace } from 'src/domain/entities/board/workspace';
import { PayloadDto } from 'src/application/dto/payload.dto';
import { MondayRepositoryService } from 'src/infra/monday/repository/monday-repository.service';

@Injectable()
export class CreateWorkspaces {
  constructor(
    private bigQueryRepositoryService: BigQueryRepository,
    private mondayRepositoryService: MondayRepositoryService,
  ) {}

  async run(payload: PayloadDto) {
    try {
      // GET MONDAY WORKSPACES
      const mondayWorkSpaces =
        await this.mondayRepositoryService.getWorkSpaces();

      // CREATE THEM ON BIGQUERY
      const data = await this.create(mondayWorkSpaces);

      // UPDATE THE PAYLOAD
      payload.addDataset(data);

      payload.updateStatus({
        step: 'Workspaces',
        success: true,
      });

      return { success: true };
    } catch (error) {
      // Update payload in case of error
      payload.updateStatus({
        step: 'Workspaces',
        success: false,
        error: error.message,
      });

      return { success: false };
    }
  }

  private async create(mondayWorkSpaces: Workspace[]) {
    // CREATE WORKSPACES ON BIGQUERY IF NOT EXISTS
    const bigQueryWorkspaces =
      await this.bigQueryRepositoryService.createDatasets(mondayWorkSpaces);

    return bigQueryWorkspaces;
  }
}
