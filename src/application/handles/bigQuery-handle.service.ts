import { BigQueryRepositoryService } from './../../infra/bigQuery/bigQuery-repository.service';
import { FilteredData } from './../bigQuery/items/filter-items.service';
import { CreateWorkspaceService } from '../bigQuery/workspace/create-workspace.service';
import { TableJobStatusDto } from '../dtos/bigQuery/table.dto';
import { Injectable } from '@nestjs/common';
import { DatasetJobStatusDto } from 'src/application/dtos/bigQuery/dataset.dto';
import { ItemsJobStatus } from 'src/application/dtos/bigQuery/items.dto';
import { MondayHandleService } from './monday-handle.service';
import { GetWorkspacesService } from '../bigQuery/workspace/get-workspaces.service';
import { SharedShape } from '../dtos/core/payload.dto';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { Dataset } from '@google-cloud/bigquery';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';

@Injectable()
export class BigQueryHandleService {
  constructor(
    private createWorkspaceService: CreateWorkspaceService,
    private getWorkspacesService: GetWorkspacesService,
    private mondayHandleService: MondayHandleService,
    private bigQueryRepositoryService: BigQueryRepository,
  ) {}

  // 1 - PRIMEIRO JOB: HANDLE DATASETS
  async handleDatasetsJob(): Promise<DatasetJobStatusDto> {
    let newDatasets: SharedShape;

    // GET MONDAY WORKSPACES
    const workspaceDto = await this.mondayHandleService.getWorkspaces();

    // FILTER DATA TO CREATE OR UPDATE
    const filteredData = await this.filterWorkspaces(workspaceDto.data);

    if (!filteredData) {
      return new DatasetJobStatusDto(null, null, null);
    }

    const { datasetsToCreate, datasetsNames } = filteredData;

    // CREATE THE DATASETS IF NEEDED
    newDatasets = await this.createWorkspaceService.run(datasetsToCreate);

    // RETURN DTO
    const datasetJobStatusDto = new DatasetJobStatusDto(
      workspaceDto,
      datasetsNames,
      newDatasets,
    );

    return datasetJobStatusDto;
  }

  // 2 - SEGUNDO JOB: HANDLE TABLES
  async handleTablesJob(): Promise<TableJobStatusDto> {
    // GET MONDAY BOARDS
    const mondayDto = await this.mondayHandleService.getBoards();

    // FILTER DATA
    const filteredData = await this.filterBoards(mondayDto.data);

    if (!filteredData) {
      return new TableJobStatusDto(null, null, null, null);
    }

    const { tablesToCreate, tablesToUpdate, tablesNames } = filteredData;

    // PRECISO CONTINUAR A IMPLEMENTAÇÃO DE ATUALIZAÇÕES DE TABELAS
    // PRECISO RESOLVER O PROBLEMA NA HORA DE PEGAR TABELAS E CONTINUAR

    // // CREATE TABLES IF NEEDED
    // // const tableDto = await this.createTables(mondayDto.data);

    // // UPDATE IF NEEDED

    return new TableJobStatusDto(mondayDto.data, tablesNames);
  }

  // 3 - HANDLE Items
  async handleItemsJob(): Promise<ItemsJobStatus> {
    // GET ITEMS

    // CREATE ITEMS ON TABLE IF NEEDED

    // UPDATE ITEMS IF NEEDED

    // DELETE ITEMS IF NEEDED

    // const crudOperationsDto = await this.crudOperations(
    //   mondayDto.data,
    //   tableDto.data,
    // );

    return;
  }

  // ------------------------------------------------------------------------------

  // async crudOperations(
  //   mondayBoards: BoardEntity[],
  //   tables: Table[],
  // ): Promise<ItemsDto> {
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

  public async filterWorkspaces(workspaces: WorkspaceEntity[]) {
    const datasetsToCreate: WorkspaceEntity[] = [];

    // GET CURRENT DATASETS
    const currentDatasets = await this.getWorkspacesService.run(workspaces);
    const datasetsNames = currentDatasets.map((dataset) => dataset.id);

    // Create a set for quick lookup based on dataset names
    const currentDatasetsMap = new Map(
      currentDatasets.map((dataset) => [
        dataset.metadata.labels.workspace_id as string,
        dataset,
      ]),
    );

    // FILTER DATA TO CREATE OR UPDATE
    for (const workspace of workspaces) {
      if (!currentDatasetsMap.has(workspace.getId())) {
        datasetsToCreate.push(workspace);
      }
    }

    return { datasetsToCreate, datasetsNames };
  }

  public async filterBoards(boards: BoardEntity[]) {
    const tablesToUpdate: string[] = [];
    const tablesToCreate: string[] = [];

    // GETTING CURRENT TABLES
    const currentTables = await this.bigQueryRepositoryService.getTables(
      boards,
    );

    const tablesNames = currentTables.map((table) => table.id);

    // Create a set for quick look-up of existing tables
    const existingTablesNames = new Set(tablesNames);

    // FILTERING DATA TO UPDATE OR CREATE
    for (const board of boards) {
      // If the board's table already exists, it's a candidate for updating
      if (existingTablesNames.has(board.name)) {
        for (const activityLog of board.activity_logs) {
          const { event, data } = activityLog;
          // Decode the data JSON field
          const parsedData = JSON.parse(data);

          // Add logic for different types of events
          switch (event) {
            case 'update_group_name':
            case 'update_name':
              tablesToUpdate.push(parsedData.board_id);
              break;
            // add other cases based on your needs
          }
        }
      } else {
        // If the board's table does not exist, it's a candidate for creation
        tablesToCreate.push(board.name);
      }
    }

    return { tablesToUpdate, tablesToCreate, tablesNames };
  }

  // CREATE TABLES
  // private async createTables(
  //   mondayBoards: BoardEntity[],
  // ): Promise<TableJobStatusDto> {
  //   try {
  //     if (!mondayBoards && mondayBoards.length == 0) {
  //       return new TableJobStatusDto(
  //         null,
  //         [],
  //         0,
  //         'Nenhum Board encontrado para criação de tabelas',
  //       );
  //     }

  //     // SET UP BOARDS AND TABLES
  //     const tables = await this.createBoardsService.run(mondayBoards);

  //     if (!tables) {
  //       return new TableJobStatusDto(null, 0, 'Falha na criação de tabelas');
  //     }

  //     return new TableJobStatusDto(
  //       tables,
  //       tables.map((table) => table.id),
  //       tables.length,
  //       'Success',
  //     );
  //   } catch (error) {
  //     return new TableJobStatusDto(null, [], 0, error.message);
  //   }
  // }

  private compareWorkspaceAndDataset(
    workspace: WorkspaceEntity,
    dataset: Dataset,
  ) {
    interface Changes {
      old?: string;
      new?: string;
    }
    // JÁ IDENTIFIQUEI OS CAMPOS QUE PRECISAM DE ALTERAÇÃO, AGORA É  SO ATUALIZAR NO BIGQUERY
    const changes: Changes = {};

    if (workspace.name !== dataset.id) {
      changes.old = dataset.id;
      changes.new = workspace.name;
    }

    return changes;
  }
}
