import { CreateDatasetService } from './create-dataset.service';
import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { BoardVo } from 'src/domain/board/board-vo';

abstract class Schema {}

@Injectable()
export class CreateTableService {
  private schema: Schema;
  private logger = new Logger(CreateTableService.name);

  constructor(private createDatasetService: CreateDatasetService) {}

  async run(bigQuery: BigQuery, boards: BoardVo[]) {
    try {
      const promises = boards.map(async (board) => {
        // Getting the board and workspace reference
        const datasetId = board.workspace.name;
        const tableId = board.name;

        // Ensure dataset exists
        await this.createDatasetService.run(bigQuery, datasetId);

        // Check if the board already exists
        const table = bigQuery.dataset(datasetId).table(tableId);
        const [exists] = await table.exists();

        if (!exists) {
          const schema = this.schemaGenerator(board);

          const [newTable] = await bigQuery
            .dataset(datasetId)
            .createTable(tableId, { schema: schema });

          console.log('Nova tabela criada', newTable.id);

          return newTable;
        }

        console.log('Tabela existe', table.id);

        return table;
      });

      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private schemaGenerator(board: BoardVo) {
    const uniqueColumnTitles = new Set();

    const schemaFromItems = board.items.flatMap((item) => {
      return item.column_values
        .map((column) => {
          if (uniqueColumnTitles.has(column.title)) return null;

          uniqueColumnTitles.add(column.title);

          return {
            name: column.title,
            type: 'STRING',
            mode: 'NULLABLE',
          };
        })
        .filter(Boolean);
    });

    this.schema = [
      { name: 'solicitacoes', type: 'STRING', mode: 'NULLABLE' },
      { name: 'grupo', type: 'STRING', mode: 'NULLABLE' },
      ...schemaFromItems,
    ];

    return this.schema;
  }
}
