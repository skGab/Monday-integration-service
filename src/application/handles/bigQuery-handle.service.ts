import { CreateWorkspaceService } from '../bigQuery/crud/create-workspace.service';
import { GetItemsService } from '../bigQuery/crud/get-items.service';
import { CreateBoardsService } from '../bigQuery/crud/create-boards.service';
import { TableVo } from '../../domain/valueObjects/table.vo';
import { ServiceResponse } from '../../domain/factory/response-factory';
import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';
import { ResponseFactory } from 'src/domain/factory/response-factory';
import { Table } from '@google-cloud/bigquery';
import { Workspace } from 'src/domain/entities/board/workspace';
import { DatasetVo } from 'src/domain/valueObjects/dataset.vo';

export abstract class BigQueryResponse {
  bigQueryTables: Table[];
  tableVo: TableVo;
}

@Injectable()
export class BigQueryHandleService {
  constructor(
    private bigQueryRepositoryService: BigQueryRepository,
    private createBoardsService: CreateBoardsService,
    private createWorkspaceService: CreateWorkspaceService,
    private getItemsService: GetItemsService,
  ) {}

  async run(mondayBoards: Board[]): Promise<ServiceResponse<BigQueryResponse>> {
    // FAST EXIST IF NO MONDAY BOARDS
    if (!mondayBoards && mondayBoards.length == 0)
      return ResponseFactory.run(Promise.resolve(null));

    const { tableVo, bigQueryTables } = await this.createTables(mondayBoards);

    const response: BigQueryResponse = {
      bigQueryTables,
      tableVo,
    };

    return ResponseFactory.run(Promise.resolve(response));
  }

  async createTables(mondayBoards: Board[]) {
    // SET UP BOARDS AND TABLES
    const { data: bigQueryTables, error: tablesError } =
      await this.createBoardsService.run(mondayBoards);

    if (tablesError) throw tablesError;

    const tableVo = new TableVo({
      names: bigQueryTables.map((table) => table.id),
      count: bigQueryTables.length,
    });

    return { tableVo, bigQueryTables };
  }

  async createDatasets(
    mondayWorkspaces: Workspace[],
  ): Promise<ServiceResponse<DatasetVo | null>> {
    // FAST EXIST IF NO MONDAY BOARDS
    if (!mondayWorkspaces && mondayWorkspaces.length == 0) {
      console.log('Nenhum Workspace encontrado para criação de Datasets');
      return ResponseFactory.run(Promise.resolve(null));
    }

    // CREATE DATASETS ON BIGQUERY
    const { data: datasetVo, error: datasetError } =
      await this.createWorkspaceService.run(mondayWorkspaces);

    if (datasetError) {
      throw datasetError;
    }

    return ResponseFactory.run(Promise.resolve(datasetVo));
  }

  async crudOperations() {
    // // CRUD OPERATIONS ON BIGQUERY
    // const { data: operationStatus, error: TransferStatusError } =
    //   await this.performCrudService.run(bigQueryResponse);
    // if (TransferStatusError) {
    //   throw TransferStatusError;
    // }
  }
}
