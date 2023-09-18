import { Injectable } from '@nestjs/common';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';

@Injectable()
export class WorkSpaceNameValidator {
  validate(mondayWorkSpaces: WorkspaceVo[]): WorkspaceVo[] {
    return mondayWorkSpaces.filter((workspace) => {
      const pattern = /^[a-zA-Z0-9_]+$/;
      return pattern.test(workspace.name.trim());
    });
  }
}
