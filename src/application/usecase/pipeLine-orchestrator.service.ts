import { TableVo } from './../../domain/valueObjects/table.vo';
import { CrudOnItemsService } from './../bigQuery/crud-on-items.service';
import { MondayHandleService } from '../handles/monday-handle.service';
import { Injectable, Logger } from '@nestjs/common';

import { BigQueryHandleService } from '../handles/bigQuery-handle.service';
import { Payload } from 'src/domain/entities/payload';
import { CreateWorkspaceService } from '../bigQuery/crud/create-workspace.service';

@Injectable()
export class PipeLineOrchestratorUsecase {
  private Logger = new Logger(PipeLineOrchestratorUsecase.name);

  constructor(
    private mondayHandleService: MondayHandleService,
    private bigQueryHandleService: BigQueryHandleService,
  ) {}

  // 1
  // CHECK FOR PROMISE.RESOLVE ON EACH SERVICE
  // BECAUSE THE RESPONSES COULD BE REJECTED PROMISES
  // THAT WOULD CAUSE getDataFromServices, RETURN A REJECTED PROMISE
  // AND WOULD FALL ON THE CONTROLLER CATCH BLOCK

  // 2 CONTINUE CHECKING FOR FAST EXIST ON BIGQUERY HANDLE AND AFTER

  // 3
  // MONTAR LOGICA DE ATUALIZAÇÃO
  // MONTAR LOGICA DE EXCLUSÃO

  // IMPLEMENTAR EMISSÃO DE EVENTOS NOS SERVIÇOS INFRA

  async run(): Promise<Payload> {
    // GETTING DATA
    const { mondayBoards } = await this.getDataFromServices();

    // INSTANCIA DO PAYLOAD
    const payload = new Payload(mondayBoards);

    console.log(payload);
    return payload;
  }

  private async getDataFromServices() {
    // GET MONDAY BOARDS
    const { data: mondayBoards, error: boardsError } =
      await this.mondayHandleService.getBoards();

    if (boardsError) {
      // console.log(boardsError);
      throw boardsError;
    }

    // // GET MONDAY WORKSPACES
    // const { data: mondayWorkspaces, error: workspacesError } =
    //   await this.mondayHandleService.getWorkspaces();

    // if (workspacesError) {
    //   console.log(workspacesError);
    //   // throw workspacesError;
    // }

    // // CREATE DATASETS ON BIGQUERY
    // const { data: datasetVo, error: datasetError } =
    //   await this.bigQueryHandleService.createDatasets(mondayWorkspaces);

    // if (datasetError) {
    //   // throw datasetError;
    // }

    // // CREATING TABLES AND BOARDS ASSOCTIATION
    // const { data: bigQueryResponse, error: bigQueryError } =
    //   await this.bigQueryHandleService.run(mondayBoards);

    // if (bigQueryError) {
    //   throw bigQueryError;
    // }

    // // CRUD OPERATIONS ON BIGQUERY
    // const { data: operationStatus, error: TransferStatusError } =
    //   await this.performCrudService.run(bigQueryResponse);

    // if (TransferStatusError) {
    //   throw TransferStatusError;
    // }

    return {
      mondayBoards,
      // mondayWorkspaces,
      // datasetVo,
    };
  }
}
