import { Workspace } from 'src/domain/board/entities/workspace';

export class WorkSpaceNameValidator {
  validate(mondayWorkSpaces: Workspace[]): Workspace[] {
    return mondayWorkSpaces.filter((workspace) => {
      const pattern = /^[a-zA-Z0-9_]+$/;
      return pattern.test(workspace.getName().trim());
    });
  }
}
