import { DatasetDto } from 'src/application/bigQuery/dtos/dataset.dto';
import { TableDto } from '../bigQuery/dtos/table.dto';
import { CrudOnItemsService } from '../bigQuery/crud-on-items.service';
import { MondayHandleService } from '../monday/monday-handle.service';
import { Injectable, Logger } from '@nestjs/common';

import { BigQueryHandleService } from '../bigQuery/bigQuery-handle.service';
import { PayloadDto } from 'src/application/core/payload.dto';
import { CreateWorkspaceService } from '../bigQuery/create/create-workspace.service';

@Injectable()
export class PipeLineOrchestratorUsecase {
  private Logger = new Logger(PipeLineOrchestratorUsecase.name);

  constructor(
    private mondayHandleService: MondayHandleService,
    private bigQueryHandleService: BigQueryHandleService,
  ) {}

  // 3
  // MONTAR LOGICA DE ATUALIZAÇÃO
  // MONTAR LOGICA DE EXCLUSÃO

  // IMPLEMENTAR EMISSÃO DE EVENTOS NOS SERVIÇOS INFRA

  async run(): Promise<PayloadDto> {
    // GETTING DATA
    const { mondayDto, workspaceDto, datasetDto, tableDto, crudOperationsDto } =
      await this.getDataFromServices();

    // INSTANCIA DO PAYLOAD
    const payload = new PayloadDto(
      mondayDto,
      workspaceDto,
      tableDto,
      datasetDto,
      crudOperationsDto,
    );

    console.log(payload);
    return payload;
  }

  // ----------------------------------------------------------------------
  // GETTING DATA
  private async getDataFromServices() {
    // GET MONDAY WORKSPACES
    const workspaceDto = await this.mondayHandleService.getWorkspaces();

    // GET MONDAY BOARDS
    const mondayDto = await this.mondayHandleService.getBoards();

    // CREATE DATASETS ON BIGQUERY
    const datasetDto = await this.bigQueryHandleService.createDatasets(
      workspaceDto.data,
    );

    // CREATING TABLES AND BOARDS ASSOCIATION
    const tableDto = await this.bigQueryHandleService.createTables(
      mondayDto.data,
    );

    // CRUD OPERATIONS ON BIGQUERY
    const crudOperationsDto = await this.bigQueryHandleService.crudOperations(
      mondayDto.data,
      tableDto.data,
    );

    return {
      mondayDto,
      workspaceDto,
      datasetDto,
      tableDto,
      crudOperationsDto,
    };
  }
}