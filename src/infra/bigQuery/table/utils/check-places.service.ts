import { CreateDatasetService } from '../../dataset/create-dataset.service';
import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { ErrorDispatch } from 'src/domain/events/error-dispatch.events';

@Injectable()
export class CheckPlacesService {
  private logger = new Logger(CheckPlacesService.name);

  constructor(
    private createDatasetService: CreateDatasetService,
    private readonly errorDispatch: ErrorDispatch,
  ) {}

  async run(board: BoardEntity, location: string, bigQuery: BigQuery) {
    // Getting the board and workspace reference
    const datasetName = board.workspace.name;
    const tableName = board.name;

    // Ensure dataset exists
    const dataset = await this.createDatasetService.create(
      location,
      bigQuery,
      board.workspace,
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
