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

      const boardIds = boards.map((board) => board.getId());
      const workspaceNames = boards.map((board) => board.workspace.name);

      const filteredTables: Table[] = [];

      for (const workspaceName of [...new Set(workspaceNames)]) {
        const dataset = bigQueryClient.dataset(workspaceName);

        const [allTables] = await dataset.getTables();

        if (!allTables || allTables.length === 0) {
          this.logger.warn(`No tables found for workspace: ${workspaceName}`);
          return null;
        }

        const workspaceFilteredTables = allTables.filter((table) => {
          return boardIds.includes(table.metadata.labels?.board_id);
        });

        filteredTables.push(...workspaceFilteredTables);
      }

      return filteredTables;
    } catch (error) {
      this.logger.error(`Error while fetching tables: ${error.message}`);
      return null;
    }
  }
}
