import { CreateBoardsService } from '../bigQuery/boards/create-boards.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsJobHandleService {
  constructor(private createBoardsService: CreateBoardsService) {}

  // 3 - HANDLE Items
  async handleItemsJob(): Promise<any> {
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

  //   ------------------------------------------------------------------------------

  //   async crudOperations(
  //     mondayBoards: BoardEntity[],
  //     tables: Table[],
  //   ): Promise<ItemsDto> {
  //     try {
  //       // FAST EXIST IF NO MONDAY BOARDS OR TABLES
  //       if (tables.length === 0 || !tables) {
  //         return new CrudOperationsDto(
  //           null,
  //           null,
  //           null,
  //           'Não foram encontrados tabelas para operações',
  //         );
  //       }

  //       // CRUD OPERATIONS ON BIGQUERY
  //       const operationsStatus = await this.crudOnItemsService.run(
  //         mondayBoards,
  //         tables,
  //       );

  //       return operationsStatus;
  //     } catch (error) {
  //       return new CrudOperationsDto(null, null, null, error);
  //     }
  //   }

  //   public async filterWorkspaces(workspaces: WorkspaceEntity[]) {
  //     const datasetsToCreate: WorkspaceEntity[] = [];

  //     // GET CURRENT DATASETS
  //     const currentDatasets = await this.getWorkspacesService.run(workspaces);

  //     // Create a set for quick lookup based on dataset names
  //     const currentDatasetsMap = new Map(
  //       currentDatasets.map((dataset) => [
  //         dataset.metadata.labels.workspace_id as string,
  //         dataset,
  //       ]),
  //     );

  //     // FILTER DATA TO CREATE OR UPDATE
  //     for (const workspace of workspaces) {
  //       if (!currentDatasetsMap.has(workspace.getId())) {
  //         datasetsToCreate.push(workspace);
  //       }
  //     }

  //     return { datasetsToCreate };
  //   }

  //   public async filterBoards(boards: BoardEntity[]) {
  //     try {
  //       // const tablesToUpdate: { names: string[]; changes: any }[] = [];
  //       const tablesToUpdate: string[] = [];
  //       const tablesToCreate: string[] = [];

  //       // GETTING CURRENT TABLES
  //       const currentTables = await this.bigQueryRepositoryService.getTables(
  //         boards,
  //       );

  //       // Create a set for quick look-up of existing tables
  //       const existingTablesNames = new Set(
  //         currentTables ? currentTables.map((table) => table.id) : [],
  //       );

  //       // FILTERING DATA TO UPDATE OR CREATE
  //       for (const board of boards) {
  //         // If the board's table already exists, it's a candidate for updating
  //         if (existingTablesNames.has(board.name)) {
  //           // for (const activityLog of board.activity_logs) {
  //           //   const { event, data } = activityLog;
  //           //   // Decode the data JSON field
  //           //   const parsedData = JSON.parse(data);

  //           //   // Add logic for different types of events
  //           //   switch (event) {
  //           //     case 'update_group_name':
  //           //     case 'update_name':
  //           //       tablesToUpdate.push({
  //           //         names: parsedData.name,
  //           //         changes: {
  //           //           oldValue: parsedData.previous_value,
  //           //           newValue: parsedData.value,
  //           //         },
  //           //       });
  //           //       break;
  //           //     // add other cases based on your needs
  //           //   }
  //           // }
  //           tablesToUpdate.push(board.name);
  //         } else {
  //           // If the board's table does not exist, it's a candidate for creation
  //           tablesToCreate.push(board.name);
  //         }
  //       }

  //       return { tablesToUpdate, tablesToCreate };
  //     } catch (error) {
  //       console.log(error);
  //       return null;
  //     }
  //   }

  //   private compareWorkspaceAndDataset(
  //     workspace: WorkspaceEntity,
  //     dataset: Dataset,
  //   ) {
  //     interface Changes {
  //       old?: string;
  //       new?: string;
  //     }
  //     // JÁ IDENTIFIQUEI OS CAMPOS QUE PRECISAM DE ALTERAÇÃO, AGORA É  SO ATUALIZAR NO BIGQUERY
  //     const changes: Changes = {};

  //     if (workspace.name !== dataset.id) {
  //       changes.old = dataset.id;
  //       changes.new = workspace.name;
  //     }

  //     return changes;
  //   }
}
