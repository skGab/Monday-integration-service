import { Table } from '@google-cloud/bigquery';
import { BoardEntity } from '../../entities/board/board-entity';
import {
  InsertResponse,
  ItemsOperation,
} from '../../../application/dtos/bigQuery/item-job-status.dto';

export abstract class RowRepository {
  // CREATE ROWS
  abstract createRows(
    mondayBoards: BoardEntity[],
  ): Promise<ItemsOperation[] | string>;

  // UPDATE ROWS
  abstract updateRows(
    items: { [key: string]: string }[],
    board: Table,
  ): Promise<InsertResponse | null>;

  // GET ROWS
  abstract getRows(board: BoardEntity): Promise<string[] | null>;
}
