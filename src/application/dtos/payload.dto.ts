import { DatasetDto } from './dataset.dto';

import { TableDto } from './table.dto';
import { MondayDto } from './monday.dto';
import { WorkspaceDto } from './workspace.dto';
import { CrudOperationsDto } from './crud-operations.dto';

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
