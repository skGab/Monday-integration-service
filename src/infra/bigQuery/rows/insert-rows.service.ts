import { BigQuery, InsertRowsResponse, Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { ItemsOperation } from 'src/application/dtos/bigQuery/item-job-status.dto';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

@Injectable()
export class InsertRowsService {
  async run(
    items: any[],
    bigQueryClient: BigQuery,
    board: BoardEntity,
  ): Promise<ItemsOperation> {
    try {
      // GETTING THE TABLE REFERENCE
      const table = bigQueryClient
        .dataset(board.workspace.name)
        .table(board.name);

      // TWO RETRIES OF 40 SEC
      let maxRetries = 2;
      let delay = 40000;

      for (let i = 0; i <= maxRetries; i++) {
        try {
          // INSERTIN DATA
          await table.insert(items);

          return {
            table: table.id,
            items: items,
            count: items.length,
            status: 'success',
          };
        } catch (insertError) {
          // RETRY TWO TIMES IF FAILED
          console.log(
            `Insert failed, attempt ${i + 1}: ${insertError.message}`,
          );
          if (i === maxRetries) {
            throw insertError; // Re-throw the error if max retries reached
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    } catch (error) {
      return {
        table: board.name,
        items: null,
        count: 0,
        status: error.message,
      };
    }
  }
}
