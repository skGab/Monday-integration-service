import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { BoardVo } from 'src/domain/board/board-vo';

@Injectable()
export class GetItemsService {
  private readonly logger = new Logger(GetItemsService.name);

  async run(
    location: string,
    board: BoardVo,
    bigQueryClient: BigQuery,
  ): Promise<string[] | null> {
    try {
      if (!board) {
        this.logger.error('Nenhum board encontrado para a busca de items');
        return null;
      }

      // Construct a SQL query based on your board. This is just a placeholder
      const sqlQuery = `SELECT id_de_elemento FROM ${board.workspace.name}.${board.name}`;

      const options = {
        query: sqlQuery,
        location: location,
      };

      // Run the query on BigQuery
      const [rows] = await bigQueryClient.query(options);

      // Extract the id_de_elemento values and return
      return rows.map((row) => row.id_de_elemento);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
