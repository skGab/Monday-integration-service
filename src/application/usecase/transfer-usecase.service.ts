import { MondayHandleService } from './handles/monday-handle.service';
import { PayloadDto } from 'src/application/dto/payload.dto';
import { WorkspaceHandleService } from './handles/workspace-handle.service';
import { Injectable } from '@nestjs/common';

import { BigQueryHandleService } from './handles/bigQuery-handle.service';
import { InsertionHandleService } from './handles/insertion-handle.service';

@Injectable()
export class TransferUsecase {
  constructor(
    private mondayHandleService: MondayHandleService,
    private workspaceHandleService: WorkspaceHandleService,
    private insertionHandleService: InsertionHandleService,
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
        return this.fail(payload, 'Failed to create workspaces');
      }

      // GET MONDAY BOARDS AND UPDATE PAYLOAD
      const boardsFetched = await this.mondayHandleService.run(payload);
      if (!boardsFetched.success) {
        return this.fail(payload, 'Failed to fetch boards');
      }

      console.log(boardsFetched);

      // // CREATING TABLES ON BIGQUERY
      // const tablesCreated = await this.createBigQueryTablesFromBoards(
      //   payload,
      //   boardsFetched.data,
      // );
      // if (!tablesCreated.success) {
      //   return this.fail(payload, 'Failed to create tables');
      // }

      // // CRUD OPERATIONS ON BIGQUERY
      // const dataInserted = await this.performCRUDOnBigQuery(
      //   payload,
      //   tablesCreated.data,
      // );
      // if (!dataInserted) {
      //   return this.fail(payload, 'Failed CRUD operations');
      // }

      console.log(payload);
      return payload;
    } catch (error) {
      return this.fail(payload, error.message);
    }
  }

  private async createBigQueryTablesFromBoards(
    payload: PayloadDto,
    boards: any,
  ): Promise<{ success: boolean; data: any }> {
    const boardTablePairs = await this.bigQueryHandleService.run(
      payload,
      boards.data,
    );

    if (!boardTablePairs.success) return { success: false, data: [] };

    return { success: true, data: boardTablePairs };
  }

  private async performCRUDOnBigQuery(
    payload: PayloadDto,
    tables: any,
  ): Promise<boolean> {
    const response = await this.insertionHandleService.run(
      payload,
      tables.data,
    );

    if (!response.success) return false;

    return true;
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
