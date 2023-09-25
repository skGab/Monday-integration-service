import { CheckPlacesService } from './check-places.service';
import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { SchemaGenerator } from './schema-generator';

@Injectable()
export class CreateTableService {
  private logger = new Logger(CreateTableService.name);
  private schemaGenerator: SchemaGenerator;

  constructor(private checkPlacesService: CheckPlacesService) {
    this.schemaGenerator = new SchemaGenerator();
  }

  async run(location: string, bigQuery: BigQuery, boards: Board[]) {
    try {
      const promises = boards.map(async (board) => {
        // Check if the board already exists
        const { exists, table, datasetId, tableId } =
          await this.checkPlacesService.run(board, location, bigQuery);

        if (!exists) {
          const schema = this.schemaGenerator.run(board);

          const [newTable] = await bigQuery
            .dataset(datasetId)
            .createTable(tableId, { schema: schema });

          console.log('--------------------------------------------');
          console.log('Nova tabela criada: ', newTable.id);
          console.log('--------------------------------------------');

          return newTable;
        }

        console.log('--------------------------------------------');
        console.log('Tabela existente: ', table.id);
        console.log('--------------------------------------------');

        return table;
      });

      const tables = await Promise.all(promises);
      return tables as Table[];
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
