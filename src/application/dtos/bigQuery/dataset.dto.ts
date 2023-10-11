import { SharedShape } from '../core/payload.dto';
import { WorkspaceDto } from '../monday/workspace.dto';

export class DatasetJobStatusDto {
  constructor(
    private mondayWorkspaces: WorkspaceDto,
    private bigQueryDatasets: string[],
    private newDatasets: SharedShape,
  ) {}
}
