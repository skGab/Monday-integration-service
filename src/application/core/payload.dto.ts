import { DatasetDto } from '../bigQuery/dtos/dataset.dto';

import { TableDto } from '../bigQuery/dtos/table.dto';
import { MondayDto } from '../monday/monday.dto';
import { WorkspaceDto } from '../monday/workspace.dto';
import { CrudOperationsDto } from '../bigQuery/dtos/crud-operations.dto';

export interface BodyShape {
  count: number;
  names: string[];
  status?: string;
}

export class PayloadDto {
  // prazo de entrega realizado
  // prazo de entrega solicitado
  constructor(
    // MONDAY DATA
    private mondayBoards: MondayDto,
    private mondayWorkspaces: WorkspaceDto,

    // BIG QUERY DATA
    private bigQueryTables: TableDto,
    private bigQueryDatasets: DatasetDto,

    // OPERATION STATUS
    private crudOperations?: CrudOperationsDto,
  ) {}
}
