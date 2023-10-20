import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

@Injectable()
export class CheckPlacesService {
  private logger = new Logger(CheckPlacesService.name);

  async run(board: BoardEntity, bigQuery: BigQuery) {
    const datasetName = board.workspace.name;

    try {
      // GET TABLES
      const tables = await this.getTablesFromDataset(datasetName, bigQuery);

      // GET EXISTING TABLE
      const tableWithBoardId = await this.findTableByBoardId(tables, board.id);

      if (tableWithBoardId) {
        return {
          exists: true,
          tablesToRefresh: {
            oldTable: tableWithBoardId.tableName as string,
            board,
          },
        };
      }
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`);
    }

    return { exists: false };
  }

  private async getTablesFromDataset(datasetName: string, bigQuery: BigQuery) {
    const [tables] = await bigQuery.dataset(datasetName).getTables();

    if (!tables) {
      this.logger.log(`No tables found in Dataset: ${datasetName}`);
      return null;
    }

    return tables;
  }

  private async findTableByBoardId(tables: Table[], boardId: string) {
    if (tables.length == 0) return null;

    const metadataPromises = tables.map((table) => table.getMetadata());
    const metadataList = await Promise.all(metadataPromises);

    const foundMetadata = metadataList.find(
      (metadata) => metadata[0].labels?.['board_id'] === boardId,
    );

    return foundMetadata
      ? { tableName: foundMetadata[0].tableReference.tableId }
      : null;
  }
}
