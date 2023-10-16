import { CreateWorkspaceService } from '../bigQuery/workspace/create-workspace.service';

import { Injectable } from '@nestjs/common';
import { DatasetJobStatusDto } from 'src/application/dtos/bigQuery/dataset-job-status.dto';
import { MondayHandleService } from './monday-handle.service';

@Injectable()
export class WorkspacesJobHandleService {
  constructor(
    private createWorkspaceService: CreateWorkspaceService,
    private mondayHandleService: MondayHandleService,
  ) {}

  // 1 - PRIMEIRO JOB: HANDLE DATASETS
  async handleDatasetsJob(): Promise<DatasetJobStatusDto> {
    // GET MONDAY WORKSPACES
    const workspaceDto = await this.mondayHandleService.getWorkspaces();

    // CREATE THE DATASETS IF NEEDED
    const operationStatus = await this.createWorkspaceService.run(
      workspaceDto.data,
    );

    // RETURN DTO
    const datasetJobStatusDto = new DatasetJobStatusDto(
      workspaceDto,
      operationStatus,
    );

    return datasetJobStatusDto;
  }
}
