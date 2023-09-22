import { CreateDatasetService } from '../services/create-dataset.service';
import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/domain/board/board';

@Injectable()
export class CheckPlacesService {
  private logger = new Logger(CheckPlacesService.name);

  constructor(private createDatasetService: CreateDatasetService) {}

  async run(board: Board, location: string, bigQuery: BigQuery) {
    // Getting the board and workspace reference
    const datasetId = board.workspace.name;
    const tableId = board.name;

    // Ensure dataset exists
    const dataset = await this.createDatasetService.run(
      location,
      bigQuery,
      datasetId,
    );

    if (dataset === null) {
      this.logger.error('Nenhum dataset disponivel para criação da tabela');
      return null;
    }

    const table = bigQuery.dataset(datasetId).table(tableId);
    const [exists] = await table.exists();

    return {
      exists,
      table,
      datasetId,
      tableId,
    };
  }
}
