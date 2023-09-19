import { BoardVo } from '../board/board-vo';
import { WorkspaceVo } from '../board/workspace-vo';

// JUST FOR REFERENCE

// type PayloadItem = {
//   solicitacao: string;
//   grupo: string;
//   responsavel: string;
//   status: string;
//   area: string;
//   prioridade: string;
//   prazo: string;
//   duracao_dias: string;
//   controle_de_tempo: string;
//   demanda: string;
//   depende_de: string;
//   cliente: string;
//   subitems: string;
//   tags: string;
//   id_de_elemento: string;
// };

type TransferResponse = {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: any[];
  errors?: any[]; // Assuming that errors are an array. You can refine this further.
  error?: string;
};

export abstract class BigQueryRepository {
  abstract createWorkspaces(workspaces: WorkspaceVo[]): Promise<string[]>;
  abstract createBoards(boards: BoardVo[]): Promise<any>;
  abstract transferDataToBoard(payload, table: any): Promise<TransferResponse>;
}
