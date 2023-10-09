import { CreateDatasetService } from '../create-dataset.service';
import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { ErrorDispatch } from 'src/domain/events/error-dispatch.events';

@Injectable()
export class CheckPlacesService {
  private logger = new Logger(CheckPlacesService.name);

  constructor(
    private createDatasetService: CreateDatasetService,
    private readonly errorDispatch: ErrorDispatch,
  ) {}

  async run(board: Board, location: string, bigQuery: BigQuery) {
    // Getting the board and workspace reference
    const datasetName = board.workspace.workspaceName();
    const tableName = board.name;

    // Ensure dataset exists
    const dataset = await this.createDatasetService.run(
      location,
      bigQuery,
      datasetName,
    );

    if (dataset === null) {
      this.logger.error('Nenhum dataset disponivel para criação da tabela');
      return null;
    }

    const table = bigQuery.dataset(datasetName).table(tableName);
    const [exists] = await table.exists();

    return {
      exists,
      table,
      datasetName,
      tableName,
    };
  }
}
