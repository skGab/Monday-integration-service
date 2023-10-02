import { MondayHandleService } from '../monday/monday-handle.service';
import { WorkspaceHandleService } from '../monday/workspace-handle.service';
import { Injectable, Logger } from '@nestjs/common';

import { BigQueryHandleService } from '../bigQuery/bigQuery-handle.service';
import { PerformCrudOperations } from '../bigQuery/perform-CRUD.service';
import { Payload } from 'src/domain/entities/payload';

@Injectable()
export class PipeLineOrchestratorUsecase {
  private Logger = new Logger(PipeLineOrchestratorUsecase.name);

  constructor(
    private mondayHandleService: MondayHandleService,
    private workspaceHandleService: WorkspaceHandleService,
    private performCrudOperations: PerformCrudOperations,
    private bigQueryHandleService: BigQueryHandleService,
  ) {}

  // PRECISO CONTINUAR REFATORANDO A CAMADA DE APLICAÇÃO

  // 3
  // MONTAR LOGICA DE ATUALIZAÇÃO
  // MONTAR LOGICA DE EXCLUSÃO

  async run(): Promise<Payload> {
    try {
      // CREATE DATASETS ON BIGQUERY AND UPDATE PAYLOAD
      const { data: workspacesCreated, error: workspaceError } =
        await this.workspaceHandleService.run();

      if (workspaceError) {
        throw Error(workspaceError);
      }

      // GET MONDAY BOARDS AND UPDATE PAYLOAD
      const { data: mondayBoards, error: mondayErrors } =
        await this.mondayHandleService.run();

      if (mondayErrors) {
        throw Error(mondayErrors);
      }

      // CREATING TABLES AND BOARDS ASSOCTIATION
      const { data: bigQueryResponse, error: bigQueryError } =
        await this.bigQueryHandleService.run(mondayBoards);

      if (bigQueryError) {
        throw Error(bigQueryError);
      }

      // CRUD OPERATIONS ON BIGQUERY
      const { data: transferStatus, error: TransferStatusError } =
        await this.performCrudOperations.run(bigQueryResponse);

      if (TransferStatusError) {
        this.Logger.error(transferStatus);
      }

      // PRECISO DESENVOLVER UMA ESTRUTURA DE TRATAÇÃO DE ERROS
      // EXIBIR O PAYLOAD CORRETO
      // E SEGUIR PARA IMPLEMENTAÇÃO DAS DEMAIS LOGICAS

      // INSTANCIA DO PAYLOAD
      const payload = new Payload(
        bigQueryResponse.tables,
        workspacesCreated,
        transferStatus,
      );
      payload.addBoard(mondayBoards);

      console.log(payload);
      return payload;
    } catch (error) {
      // return this.fail(Payload, error.message);
      console.error(error);
      throw error;
    }
  }

  // private fail(payload: Payload, errorMsg: string): Payload {
  //   const response = payload.status.map((s) => {
  //     s.error;
  //   });

  //   return payload;
  // }
}
