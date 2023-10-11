import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { BoardEntity } from '../entities/board/board-entity';
import { WorkspaceEntity } from '../entities/board/workspace-entity';
import { TransferResponse } from '../../application/dtos/bigQuery/items.dto';

export abstract class BigQueryRepository {
  // TABLES
  abstract createTables(boards: BoardEntity[]): Promise<Table[] | null>;
  abstract getTables(boards: BoardEntity[]): Promise<Table[] | null>;

  // ROWS
  abstract insertRows(
    items: { [key: string]: string }[],
    table: Table,
  ): Promise<TransferResponse | null>;
  abstract updateRows(
    items: { [key: string]: string }[],
    board: Table,
  ): Promise<TransferResponse | null>;
  abstract getRows(board: BoardEntity): Promise<string[] | null>;

  // DATASETS
  abstract getDatasets(
    workspaces: WorkspaceEntity[],
  ): Promise<Dataset[] | null>;

  abstract createDatasets(
    datasetsToCreate: WorkspaceEntity[],
  ): Promise<Dataset[] | null>;
}
