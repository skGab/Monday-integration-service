import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';

@Injectable()
export class GetRowsService {
  private readonly logger = new Logger(GetRowsService.name);

  async run(
    location: string,
    board: Board,
    bigQueryClient: BigQuery,
  ): Promise<string[] | null> {
    if (!board) {
      this.logger.error('Nenhum board encontrado para a busca de items');
      return null;
    }

    // Construct a SQL query based on your board. This is just a placeholder
    const sqlQuery = `SELECT * FROM ${board.workspace.name}.${board.name}`;

    const options = {
      query: sqlQuery,
      location: location,
    };

    // Run the query on BigQuery
    const [rows] = await bigQueryClient.query(options);

    if (!rows) return null;

    // Extract the id_de_elemento values and return
    return rows.map((row) => row.id_de_elemento);
  }
}
