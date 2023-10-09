import { CrudOnItemsService } from './crud-on-items.service';
import { CreateWorkspaceService } from './create/create-workspace.service';
import { CreateBoardsService } from './create/create-boards.service';
import { TableDto } from './dtos/table.dto';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { Table } from '@google-cloud/bigquery';
import { Workspace } from 'src/domain/entities/board/workspace';
import { DatasetDto } from 'src/application/bigQuery/dtos/dataset.dto';
import { CrudOperationsDto } from 'src/application/bigQuery/dtos/crud-operations.dto';

@Injectable()
export class BigQueryHandleService {
  constructor(
    private createBoardsService: CreateBoardsService,
    private createWorkspaceService: CreateWorkspaceService,
    private crudOnItemsService: CrudOnItemsService,
  ) {}

  async createTables(mondayBoards: Board[]): Promise<TableDto> {
    try {
      if (!mondayBoards && mondayBoards.length == 0) {
        return new TableDto(
          null,
          [],
          0,
          'Nenhum Board encontrado para criação de tabelas',
        );
      }

      // SET UP BOARDS AND TABLES
      const tables = await this.createBoardsService.run(mondayBoards);

      if (!tables) {
        return new TableDto(null, [], 0, 'Falha na criação de tabelas');
      }

      return new TableDto(
        tables,
        tables.map((table) => table.id),
        tables.length,
        'Success',
      );
    } catch (error) {
      return new TableDto(null, [], 0, error.message);
    }
  }

  async createDatasets(mondayWorkspaces: Workspace[]): Promise<DatasetDto> {
    try {
      // FAST EXIST IF NO MONDAY BOARDS
      if (!mondayWorkspaces) {
        return new DatasetDto(
          null,
          [],
          0,
          'Nenhuma area de trabalho encontrada para criação de Datasets',
        );
      }

      // CREATE DATASETS ON BIGQUERY
      const datasetDto = await this.createWorkspaceService.run(
        mondayWorkspaces,
      );

      return datasetDto;
    } catch (error) {
      return new DatasetDto(null, [], 0, error.message);
    }
  }

  async crudOperations(
    mondayBoards: Board[],
    tables: Table[],
  ): Promise<CrudOperationsDto> {
    try {
      // FAST EXIST IF NO MONDAY BOARDS
      if (!mondayBoards || !tables) {
        return new CrudOperationsDto(
          null,
          null,
          null,
          'Não foram encontrados quadros ou tabelas para operações',
        );
      }

      // CRUD OPERATIONS ON BIGQUERY
      const operationsStatus = await this.crudOnItemsService.run(
        mondayBoards,
        tables,
      );

      return operationsStatus;
    } catch (error) {
      return new CrudOperationsDto(null, null, null, error);
    }
  }
}
