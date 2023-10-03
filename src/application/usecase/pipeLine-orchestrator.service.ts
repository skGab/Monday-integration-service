import { MondayHandleService } from '../monday/monday-handle.service';
import { Injectable, Logger } from '@nestjs/common';

import { BigQueryHandleService } from '../bigQuery/bigQuery-handle.service';
import { Payload } from 'src/domain/entities/payload';
import { PerformCrudService } from '../bigQuery/perform-crud.service';
import { CreateWorkspaceService } from '../bigQuery/utils/create-workspace.service';

@Injectable()
export class PipeLineOrchestratorUsecase {
  private Logger = new Logger(PipeLineOrchestratorUsecase.name);

  constructor(
    private mondayHandleService: MondayHandleService,
    private performCrudService: PerformCrudService,
    private bigQueryHandleService: BigQueryHandleService,
    private createWorkspaceService: CreateWorkspaceService,
  ) {}

  // 3
  // MONTAR LOGICA DE ATUALIZAÇÃO
  // MONTAR LOGICA DE EXCLUSÃO

  // IMPLEMENTAR PROMISE RESOLVE NOS PRIMEIROS SERVIÇOS
  // IMPLEMENTAR EMISSÃO DE EVENTOS NOS SERVIÇOS INFRA

  async run(): Promise<Payload> {
    // GETTING RESULTS FROM BOARDS
    const { dataset, bigQueryResponse, operationStatus, mondayBoards } =
      await this.getDataFromServices();

    // INSTANCIA DO PAYLOAD
    const payload = new Payload(
      bigQueryResponse.tables,
      dataset,
      operationStatus,
    );

    payload.addBoard(mondayBoards);

    console.log(payload);
    return payload;
  }

  private async getDataFromServices() {
    //  GET MONDAY DATA
    const {
      data: { boards: mondayBoards, workspaces: mondayWorkspaces },
    } = await this.mondayHandleService.run();

    // CREATE DATASETS ON BIGQUERY
    const { data: dataset, error: datasetError } =
      await this.createWorkspaceService.run(mondayWorkspaces);

    if (datasetError) {
      throw datasetError;
    }

    // CREATING TABLES AND BOARDS ASSOCTIATION
    const { data: bigQueryResponse, error: bigQueryError } =
      await this.bigQueryHandleService.run(mondayBoards);

    if (bigQueryError) {
      throw bigQueryError;
    }

    // CRUD OPERATIONS ON BIGQUERY
    const { data: operationStatus, error: TransferStatusError } =
      await this.performCrudService.run(bigQueryResponse);

    if (TransferStatusError) {
      throw TransferStatusError;
    }

    return {
      dataset,
      bigQueryResponse,
      operationStatus,
      mondayBoards,
    };
  }
}
