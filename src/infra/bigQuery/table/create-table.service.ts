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
        // CHECKING FOR TABLE AND DATASETS EXISTENCES
        const { exists, table, datasetName, tableName } =
          await this.checkPlacesService.run(board, location, bigQuery);

        // CREATING TABLE IF NOT EXISTES
        if (!exists) {
          const schema = this.schemaGenerator.run(board);

          console.log(schema);

          const [newTable] = await bigQuery
            .dataset(datasetName)
            .createTable(tableName, { schema: schema });

          // RETURNING NEW TABLE
          return newTable;
        }

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
