import { Table } from '@google-cloud/bigquery';
import { BoardEntity } from '../../entities/board/board-entity';
import { TransferResponse } from '../../../application/dtos/bigQuery/item-job-status.dto';

export abstract class RowRepository {
  // CREATE ROWS
  abstract createRows(
    items: { [key: string]: string }[],
    table: Table,
  ): Promise<TransferResponse | null>;

  // UPDATE ROWS
  abstract updateRows(
    items: { [key: string]: string }[],
    board: Table,
  ): Promise<TransferResponse | null>;

  // GET ROWS
  abstract getRows(board: BoardEntity): Promise<string[] | null>;
}
