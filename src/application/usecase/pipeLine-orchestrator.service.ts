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
      const workspacesCreated = await this.workspaceHandleService.run();

      if (!workspacesCreated.success) {
        throw Error(workspacesCreated as any).message;
      }

      // GET MONDAY BOARDS AND UPDATE PAYLOAD
      const mondayBoards = await this.mondayHandleService.run();

      if (!mondayBoards.success) {
        throw Error('Erro durante a busca de quadros');
      }

      // CREATING TABLES AND BOARDS ASSOCTIATION
      const bigQueryResponse = await this.bigQueryHandleService.run(
        mondayBoards.data,
      );
      if (!bigQueryResponse.success) {
        throw Error('Erro durante a criacao e associacao de tabelas');
      }

      // CRUD OPERATIONS ON BIGQUERY
      const transferStatus = await this.performCrudOperations.run(
        bigQueryResponse.data,
      );
      if (!transferStatus.success) {
        this.Logger.error(transferStatus);
      }

      // PRECISO DESENVOLVER UMA ESTRUTURA DE TRATAÇÃO DE ERROS
      // EXIBIR O PAYLOAD CORRETO
      // E SEGUIR PARA IMPLEMENTAÇÃO DAS DEMAIS LOGICAS

      // INSTANCIA DO PAYLOAD
      const payload = new Payload(
        bigQueryResponse.data.tables,
        workspacesCreated.data,
        transferStatus.data,
      );
      payload.addBoard(mondayBoards.data);

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
