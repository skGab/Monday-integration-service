import { Table } from '@google-cloud/bigquery';
import { BoardEntity } from '../../entities/board/board-entity';
import { SharedShape } from 'src/application/dtos/core/payload.dto';

export abstract class TableRepository {
  // CREATE TABLES
  abstract createTables(boards: BoardEntity[]): Promise<{
    createdTables: string[];
    existingTables: string[];
    errors: string[];
  }>;
  // GET TABLES
  abstract getTables(boards: BoardEntity[]): Promise<Table[] | null>;

  // UPDATE TABLES
  abstract updateTables(
    tablesToRefresh: { oldTable: string; board: BoardEntity }[],
  ): Promise<SharedShape | string>;
}
