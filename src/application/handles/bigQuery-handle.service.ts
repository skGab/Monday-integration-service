import { UpdateWorkspaceService } from './../bigQuery/workspace/update-workspace.service';
import { CrudOnItemsService } from '../bigQuery/crud-on-items.service';
import { CreateWorkspaceService } from '../bigQuery/workspace/create-workspace.service';
import { CreateBoardsService } from '../bigQuery/create/create-boards.service';
import { TableDto } from '../dtos/bigQuery/table.dto';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { Table } from '@google-cloud/bigquery';
import { Workspace } from 'src/domain/entities/board/workspace';
import {
  DatasetDto,
  SharedShape,
} from 'src/application/dtos/bigQuery/dataset.dto';
import { CrudOperationsDto } from 'src/application/dtos/bigQuery/crud-operations.dto';
import { MondayHandleService } from './monday-handle.service';
import { GetWorkspacesService } from '../bigQuery/workspace/get-workspaces.service';

@Injectable()
export class BigQueryHandleService {
  constructor(
    private createBoardsService: CreateBoardsService,
    private createWorkspaceService: CreateWorkspaceService,
    private crudOnItemsService: CrudOnItemsService,
    private getWorkspacesService: GetWorkspacesService,
    private mondayHandleService: MondayHandleService,
    private updateWorkspaceService: UpdateWorkspaceService,
  ) {}

  // 1 - PRIMEIRO JOB: HANDLE DATASETS
  async handleDatasetsJob(): Promise<DatasetDto> {
    let newDatasets: SharedShape;
    let updatedDatasets: SharedShape;

    // GET MONDAY WORKSPACES
    const workspaceDto = await this.mondayHandleService.getWorkspaces();

    // FILTER DATA TO CREATE OR UPDATE
    const filteredData = await this.filterData(workspaceDto.data);

    if (!filteredData) {
      return new DatasetDto(null, null, null);
    }

    const { datasetsToUpdate, datasetsToCreate } = filteredData;

    // CREATE THE DATASETS IF NEEDED
    if (datasetsToCreate.length !== 0) {
      newDatasets = await this.createWorkspaceService.run(datasetsToCreate);
    } else {
      newDatasets = {
        names: null,
        count: 0,
        status: 'Não ha novos Datasets para serem criados',
      };
    }

    // UPDATE WORKSPACES
    if (datasetsToUpdate.length !== 0) {
      updatedDatasets = await this.updateWorkspaceService.run(datasetsToUpdate);
    } else {
      updatedDatasets = {
        names: null,
        count: 0,
        status: 'Não ha Datasets para serem atualizados',
      };
    }

    // RETURN DTO
    const datasetDto = new DatasetDto(
      workspaceDto,
      newDatasets,
      updatedDatasets,
    );

    return datasetDto;
  }

  // // CREATE TABLES
  // async createTables(mondayBoards: Board[]): Promise<TableDto> {
  //   try {
  //     if (!mondayBoards && mondayBoards.length == 0) {
  //       return new TableDto(
  //         null,
  //         [],
  //         0,
  //         'Nenhum Board encontrado para criação de tabelas',
  //       );
  //     }

  //     // SET UP BOARDS AND TABLES
  //     const tables = await this.createBoardsService.run(mondayBoards);

  //     if (!tables) {
  //       return new TableDto(null, [], 0, 'Falha na criação de tabelas');
  //     }

  //     return new TableDto(
  //       tables,
  //       tables.map((table) => table.id),
  //       tables.length,
  //       'Success',
  //     );
  //   } catch (error) {
  //     return new TableDto(null, [], 0, error.message);
  //   }
  // }

  // // EXCLUIR DEPOIS
  // async crudOperations(
  //   mondayBoards: Board[],
  //   tables: Table[],
  // ): Promise<CrudOperationsDto> {
  //   try {
  //     // FAST EXIST IF NO MONDAY BOARDS OR TABLES
  //     if (tables.length === 0 || !tables) {
  //       return new CrudOperationsDto(
  //         null,
  //         null,
  //         null,
  //         'Não foram encontrados tabelas para operações',
  //       );
  //     }

  //     // CRUD OPERATIONS ON BIGQUERY
  //     const operationsStatus = await this.crudOnItemsService.run(
  //       mondayBoards,
  //       tables,
  //     );

  //     return operationsStatus;
  //   } catch (error) {
  //     return new CrudOperationsDto(null, null, null, error);
  //   }
  // }

  public async filterData(workspaces: Workspace[]) {
    const datasetsToCreate: Workspace[] = [];
    const datasetsToUpdate: Workspace[] = [];

    // GET CURRENT DATASETS
    const currentDatasets = await this.getWorkspacesService.run(workspaces);

    // Create a map for quick lookup
    const currentDatasetsMap = new Map(
      currentDatasets.map((dataset) => [dataset.id, dataset]),
    );

    // FILTER DATA TO CREATE OR UPDATE
    for (const workspace of workspaces) {
      if (currentDatasetsMap.has(workspace.name)) {
        // Dataset exists, update required
        datasetsToUpdate.push(workspace);
      } else {
        // Dataset doesn't exist, creation required
        datasetsToCreate.push(workspace);
      }
    }

    return { datasetsToUpdate, datasetsToCreate };
  }
}
