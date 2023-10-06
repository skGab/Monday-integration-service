import { Dataset, Table } from '@google-cloud/bigquery';
import { Board } from '../entities/board/board';
import { Workspace } from '../entities/board/workspace';
import { TransferResponse } from '../../application/bigQuery/dtos/crud-operations.dto';

export abstract class BigQueryRepository {
  // CREATE WORKSPACES
  abstract createDatasets(workspaces: Workspace[]): Promise<Dataset[] | null>;

  // CREATE BOARDS
  abstract createTables(boards: Board[]): Promise<Table[] | null>;

  // TRANSFER ITEMS TO BOARD
  abstract insertRows(
    items: { [key: string]: string }[],
    table: Table,
  ): Promise<TransferResponse | null>;

  // UPDATE BOARD ITEMS
  abstract updateRows(
    items: { [key: string]: string }[],
    board: Table,
  ): Promise<TransferResponse | null>;

  // GET ITEMS FROM BOARD
  abstract getRows(board: Board): Promise<string[] | null>;
}
