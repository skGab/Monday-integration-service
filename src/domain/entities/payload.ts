import { DatasetVo } from '../valueObjects/dataset.vo';
import { TableVo } from '../valueObjects/table.vo';
import { Board } from './board/board';
import { CrudOperationsVo } from '../valueObjects/crud-operations.vo';
import { ServiceStatusVo } from '../valueObjects/service-status.vo';
import { Workspace } from './board/workspace';
export interface BodyShape {
  count: number;
  names: string[];
  message?: string;
}

export class Payload {
  // prazo de entrega realizado
  // prazo de entrega solicitado
  constructor(
    // MONDAY DATA
    private mondayBoards: BodyShape | Board[],
    private mondayWorkspaces: BodyShape | Workspace[],

    // BIG QUERY DATA
    private bigQueryDatasets: DatasetVo,
    private bigQueryTables?: TableVo,

    // OPERATION STATUS
    private crudOperations?: CrudOperationsVo,
    private serviceStatus?: ServiceStatusVo[],
  ) {
    this.boardsMap(mondayBoards);
    this.workspacesMap(mondayWorkspaces);
  }

  private boardsMap(mondayBoards: BodyShape | Board[]) {
    if (Array.isArray(mondayBoards)) {
      this.mondayBoards = {
        count: mondayBoards.length,
        names: mondayBoards.map((board) => board.getBoardName()),
      };
    }
  }

  private workspacesMap(mondayWorkspaces: BodyShape | Workspace[]) {
    if (Array.isArray(mondayWorkspaces)) {
      this.mondayWorkspaces = {
        count: mondayWorkspaces.length,
        names: mondayWorkspaces.map((workspace) => workspace.getName()),
      };
    }
  }
}
