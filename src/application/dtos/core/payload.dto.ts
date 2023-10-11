import { ItemsJobStatus } from '../bigQuery/items.dto';
import { DatasetJobStatusDto } from '../bigQuery/dataset.dto';

import { TableJobStatusDto } from '../bigQuery/table.dto';
import { MondayDto } from '../monday/monday.dto';
import { WorkspaceDto } from '../monday/workspace.dto';

export interface SharedShape {
  names: string[] | [];
  count: number;
  status: string;
}

export class PayloadDto {
  // prazo de entrega realizado
  // prazo de entrega solicitado
  constructor(
    private datasetJobStatus: DatasetJobStatusDto,
    private tableJobStatus?: TableJobStatusDto,
    private itemsJobStatus?: ItemsJobStatus,
  ) {}
}
