import { MondayHandleService } from '../monday/monday-handle.service';
import { PayloadDto } from 'src/application/dto/payload.dto';
import { WorkspaceHandleService } from '../monday/workspace-handle.service';
import { Injectable } from '@nestjs/common';

import { BigQueryHandleService } from '../bigQuery/bigQuery-handle.service';
import { PerformCrudOperations } from '../bigQuery/perform-CRUD.service';

@Injectable()
export class PipeLineOrchestratorUsecase {
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

  async run(): Promise<PayloadDto> {
    const payload = new PayloadDto();
    try {
      // CREATE DATASETS ON BIGQUERY AND UPDATE PAYLOAD
      const workspacesCreated = await this.workspaceHandleService.run(payload);
      if (!workspacesCreated) {
        return this.fail(payload, 'Falha ao criar Datasets');
      }

      // GET MONDAY BOARDS AND UPDATE PAYLOAD
      const mondayBoards = await this.mondayHandleService.run(payload);
      if (!mondayBoards.success) {
        return this.fail(payload, 'Falha na busca de quadros do Monday');
      }

      // CREATING TABLES AND BOARDS ASSOCTIATION
      const bigQueryResponse = await this.bigQueryHandleService.run(
        payload,
        mondayBoards.data,
      );
      if (!bigQueryResponse.success) {
        return this.fail(
          payload,
          'Falha na criacao de tabelas e associacao de boards',
        );
      }

      // CRUD OPERATIONS ON BIGQUERY
      const dataInserted = await this.performCrudOperations.run(
        payload,
        bigQueryResponse.data,
      );
      if (!dataInserted.success) {
        return this.fail(payload, 'Failed CRUD operations');
      }

      console.log(payload);
      return payload;
    } catch (error) {
      return this.fail(payload, error.message);
    }
  }

  private fail(payload: PayloadDto, errorMsg: string): PayloadDto {
    payload.updateStatus({
      step: 'General',
      success: false,
      error: errorMsg,
    });
    return payload;
  }
}
