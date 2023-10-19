import { WorkspaceDto } from '../monday/workspace.dto';

export class DatasetJobStatusDto {
  constructor(
    private avaliableDatasets: string[] | string,
    private mondayWorkspaces: WorkspaceDto,
  ) {}
}
