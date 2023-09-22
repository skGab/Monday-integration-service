import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { WorkSpaceNameValidator } from './workspaceName-validator';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';
import { MondayRepository } from 'src/domain/monday/monday-repository';

@Injectable()
export class HandleBigQueryWorkspacesService {
  constructor(
    private bigQueryRepositoryService: BigQueryRepository,
    private workspaceNameValidator: WorkSpaceNameValidator,
    private mondayRepositoryService: MondayRepository,
  ) {}

  async run(payload: any) {
    try {
      // Fetch workspaces from Monday
      const mondayWorkSpaces =
        await this.mondayRepositoryService.getWorkSpaces();

      // Handle them in BigQuery
      const data = await this.handleWorkspaces(mondayWorkSpaces);

      // Update payload
      payload.bqDatasets = data;
      payload.status.push({
        step: 'Workspaces',
        success: true,
      });

      return { success: true };
    } catch (error) {
      // Update payload in case of error
      payload.status.push({
        step: 'Workspaces',
        success: false,
        error: error.message,
      });

      return { success: false };
    }
  }

  private async handleWorkspaces(mondayWorkSpaces: WorkspaceVo[]) {
    // VALIDATE WORKSPACES NAME
    const validWorkspacesNames =
      this.workspaceNameValidator.validate(mondayWorkSpaces);

    // CREATE WORKSPACES ON BIGQUERY IF NOT EXISTS
    const bigQueryWorkspaces =
      await this.bigQueryRepositoryService.createDatasets(validWorkspacesNames);

    return bigQueryWorkspaces;
  }
}
