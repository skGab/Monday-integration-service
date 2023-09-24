import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { WorkSpaceNameValidator } from './workspaceName-validator';
import { Workspace } from 'src/domain/board/entities/workspace';
import { MondayRepository } from 'src/domain/monday/monday-repository';
import { Payload } from 'src/domain/response/payload';

@Injectable()
export class HandleBigQueryWorkspacesService {
  constructor(
    private bigQueryRepositoryService: BigQueryRepository,
    private workspaceNameValidator: WorkSpaceNameValidator,
    private mondayRepositoryService: MondayRepository,
  ) {}

  async run(payload: Payload) {
    try {
      // Fetch workspaces from Monday
      const mondayWorkSpaces =
        await this.mondayRepositoryService.getWorkSpaces();

      // Handle them in BigQuery
      const data = await this.handleWorkspaces(mondayWorkSpaces);

      // Update payload
      payload.addDataset(data[0]);

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

  private async handleWorkspaces(mondayWorkSpaces: Workspace[]) {
    // VALIDATE WORKSPACES NAME
    const validWorkspacesNames =
      this.workspaceNameValidator.validate(mondayWorkSpaces);

    // CREATE WORKSPACES ON BIGQUERY IF NOT EXISTS
    const bigQueryWorkspaces =
      await this.bigQueryRepositoryService.createDatasets(validWorkspacesNames);

    return bigQueryWorkspaces;
  }
}
