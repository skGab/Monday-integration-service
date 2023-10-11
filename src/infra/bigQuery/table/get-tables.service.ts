import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

@Injectable()
export class GetTablesService {
  private logger = new Logger(GetTablesService.name);

  async run(
    bigQueryClient: BigQuery,
    boards: BoardEntity[],
  ): Promise<Table[] | null> {
    try {
      if (!boards || boards.length === 0) {
        this.logger.error('No boards found for fetching tables');
        return null;
      }

      // Map the board IDs and workspaces for quick lookup
      const boardIds = boards.map((board) => board.getId());
      const workspaceNames = boards.map((board) => board.workspace.name);

      const filteredTables: Table[] = [];

      // Iterate through each unique workspace name
      for (const workspaceName of [...new Set(workspaceNames)]) {
        // Fetch all tables in the dataset corresponding to the workspace
        const dataset = bigQueryClient.dataset(workspaceName);


        // AQUI NÃO ESTA RETORNANDO AS TABELAS
        const [allTables] = await dataset.getTables();

        // Filter tables based on board IDs
        const workspaceFilteredTables = allTables.filter((table) => {
          return boardIds.includes(table.metadata.labels?.board_id);
        });

        filteredTables.push(...workspaceFilteredTables);
      }

      console.log(filteredTables);

      return filteredTables;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
