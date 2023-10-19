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
    bigQuery: BigQuery,
    board: BoardEntity,
  ): Promise<CreateTableResponse> {
    try {
      const dataset = bigQuery.dataset(board.workspace.name);

      const { exists, tablesToRefresh } = await this.checkPlacesService.run(
        board,
        bigQuery,
      );

      // CREATING TABLE IF NOT EXISTES
      if (!exists) {
        const schema = this.schemaGenerator.run(board);

        const options = {
          schema: schema,
          labels: {
            board_id: board.getId(),
          },
        };

        const [newTable] = await dataset.createTable(board.name, options);

        console.log('Nova Tabela criada:', board.name);

        // RETURNING NEW TABLE
        return { newTable: newTable.id };
      }

      // Delete the old table
      await dataset.table(tablesToRefresh.oldTable).delete();

      const schema = this.schemaGenerator.run(board);

      const options = {
        schema: schema,
        labels: {
          board_id: board.getId(),
        },
      };

      const [existingTable] = await dataset.createTable(board.name, options);

      console.log('Tabela existente:', existingTable.id);

      // RETURNING EXISTING TALBE
      return { existingTable: existingTable.id };
    } catch (error) {
      this.logger.error(error);
      return { error: `Erro na criação: ${board.name}` };
    }
  }
}
