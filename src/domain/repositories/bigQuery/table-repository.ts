import { Table } from '@google-cloud/bigquery';
import { BoardEntity } from '../../entities/board/board-entity';

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
  abstract updateTables(filteredBoards: BoardEntity[]): Promise<any>;
}
