import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { MondayRepository } from 'src/domain/monday/monday-repository';
import { WorkSpaceNameValidator } from './workspaceName-validator.service';

@Injectable()
export class HandleBigQueryWorkspacesService {
  constructor(
    private mondayRepositoryService: MondayRepository,
    private bigQueryRepository: BigQueryRepository,
    private workspaceNameValidator: WorkSpaceNameValidator,
  ) {}
  async run() {
    // GET WORKSPACES
    const mondayWorkSpaces = await this.mondayRepositoryService.getWorkSpaces();

    // VALIDATE WORKSPACES NAME
    const validWorkspacesNames =
      this.workspaceNameValidator.validate(mondayWorkSpaces);

    // CREATE WORKSPACES ON BIGQUERY IF NOT EXISTS
    const bigQueryWorkspaces = await this.bigQueryRepository.createWorkspaces(
      validWorkspacesNames,
    );

    return bigQueryWorkspaces;
  }
}
