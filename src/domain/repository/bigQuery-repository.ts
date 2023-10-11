import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { Board } from '../entities/board/board';
import { Workspace } from '../entities/board/workspace';
import { TransferResponse } from '../../application/dtos/bigQuery/crud-operations.dto';

export abstract class BigQueryRepository {
  // TABLES
  abstract createTables(boards: Board[]): Promise<Table[] | null>;

  // ROWS
  abstract insertRows(
    items: { [key: string]: string }[],
    table: Table,
  ): Promise<TransferResponse | null>;
  abstract updateRows(
    items: { [key: string]: string }[],
    board: Table,
  ): Promise<TransferResponse | null>;
  abstract getRows(board: Board): Promise<string[] | null>;

  // DATASETS
  abstract getDatasets(workspaces: Workspace[]): Promise<Dataset[] | null>;
  abstract updateDatasets(workspaces: Workspace[]): Promise<Dataset[] | null>;
  abstract createDatasets(
    datasetsToCreate: Workspace[],
  ): Promise<Dataset[] | null>;
}
