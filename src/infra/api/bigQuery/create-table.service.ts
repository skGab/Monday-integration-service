import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { BoardVo } from 'src/domain/valueObjects/board-vo';

abstract class Schema {}

@Injectable()
export class CreateTableService {
  private readonly schema: Schema;
  private logger = new Logger(CreateTableService.name);

  async run(bigQuery: BigQuery, boards: BoardVo[]) {
    try {
      const promises = boards.map(async (board) => {
        const datasetId = board.workspace.name;
        const tableId = board.name;

        const table = bigQuery.dataset(datasetId).table(tableId);
        const [exists] = await table.exists();

        if (!exists) {
          const newTable = await bigQuery
            .dataset(datasetId)
            .createTable(tableId, { schema: this.schema });

          console.log('Nova tabela criada', newTable);
          return newTable;
        }

        console.log('Tabela existe', table);
        return table;
      });

      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
