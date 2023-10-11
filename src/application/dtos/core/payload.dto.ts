import { DatasetDto } from '../bigQuery/dataset.dto';

import { TableDto } from '../bigQuery/table.dto';
import { MondayDto } from '../monday/monday.dto';
import { WorkspaceDto } from '../monday/workspace.dto';
import { CrudOperationsDto } from '../bigQuery/crud-operations.dto';

export interface BodyShape {
  count: number;
  names: string[];
  status?: string;
}

export class PayloadDto {
  // prazo de entrega realizado
  // prazo de entrega solicitado
  constructor(
    // BIG QUERY DATA
    private datasetJobStatus: DatasetDto,
    private tableJobStatus?: TableDto,

    // MONDAY DATA
    private mondayWorkspaces?: WorkspaceDto,
    private mondayBoards?: MondayDto,

    // OPERATION STATUS
    private crudOperations?: CrudOperationsDto,
  ) {}
}
