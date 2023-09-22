import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { WorkSpaceNameValidator } from './workspaceName-validator';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';

@Injectable()
export class HandleBigQueryWorkspacesService {
  constructor(
    private bigQueryRepository: BigQueryRepository,
    private workspaceNameValidator: WorkSpaceNameValidator,
  ) {}
  async run(mondayWorkSpaces: WorkspaceVo[]) {
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
