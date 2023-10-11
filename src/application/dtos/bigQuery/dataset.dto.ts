import { WorkspaceDto } from '../monday/workspace.dto';

export interface SharedShape {
  names: string[] | [];
  count: number;
  status: string;
}

export class DatasetDto {
  constructor(
    private mondayWorkspaces: WorkspaceDto,
    private newDatasets: SharedShape,
    private updatedDatasets: SharedShape,
  ) {}
}
