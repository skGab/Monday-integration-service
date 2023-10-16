import { CheckPlacesService } from './utils/check-places.service';
import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { SchemaGenerator } from './utils/schema-generator';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

interface CreateTableResponse {
  newTable?: string;
  existingTable?: string;
  error?: string;
}

@Injectable()
export class CreateTablesService {
  private logger = new Logger(CreateTablesService.name);
  private schemaGenerator: SchemaGenerator;

  constructor(private checkPlacesService: CheckPlacesService) {
    this.schemaGenerator = new SchemaGenerator();
  }

  async run(
    location: string,
    bigQuery: BigQuery,
    board: BoardEntity,
  ): Promise<CreateTableResponse> {
    try {
      const { exists, table, datasetName, tableName } =
        await this.checkPlacesService.run(board, location, bigQuery);

      // CREATING TABLE IF NOT EXISTES
      if (!exists) {
        const schema = this.schemaGenerator.run(board);

        const options = {
          schema: schema,
          labels: {
            board_id: board.getId(),
          },
        };

        const [newTable] = await bigQuery
          .dataset(datasetName)
          .createTable(tableName, options);

        console.log('Nova Tabela criada:', newTable.id);

        // RETURNING NEW TABLE
        return { newTable: newTable.id };
      }

      console.log('Tabela existente:', table.id);

      // RETURNING EXISTING TALBE
      return { existingTable: table.id };
    } catch (error) {
      this.logger.error(error);
      return { error: `Erro na criação: ${board.name}` };
    }
  }
}
