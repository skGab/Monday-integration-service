import { PayloadDto } from 'src/application/dto/payload.dto';
import { CreateWorkspaces } from './handles/create-workspaces.service';
import { Injectable } from '@nestjs/common';

import { FetchBoardsService } from './handles/fetch-boards.service';

import { BigQueryHandleService } from './handles/bigQuery-handle.service';
import { InsertionHandleService } from './handles/insertion-handle.service';

@Injectable()
export class TransferUsecase {
  constructor(
    private fechBoardsService: FetchBoardsService,
    private createWorkspaces: CreateWorkspaces,
    private insertionHandleService: InsertionHandleService,
    private bigQueryHandleService: BigQueryHandleService,
  ) {}

  // 2
  // TRATAÇÃO E VISUALIZAÇÃO DO PAYLOAD NO TERMINAL

  // 3
  // MONTAR LOGICA DE ATUALIZAÇÃO
  // MONTAR LOGICA DE EXCLUSÃO

  async run(): Promise<PayloadDto> {
    const payload = new PayloadDto();
    try {
      // CREATE DATASETS ON BIGQUERY AND UPDATE PAYLOAD
      await this.createWorkspaces.run(payload);

      // GET MONDAY BOARDS AND UPDATE PAYLOAD
      const boardsStatus = await this.fechBoardsService.run(payload);

      if (boardsStatus.success) {
        // CREATING TABLES FROM BOARDS ON BIGQUERY AND UPDATE THE PAYLOAD
        const setupStatus = await this.bigQueryHandleService.run(
          payload,
          boardsStatus.data,
        );

        // CRUD OPERATIONS ON THE BIGQUERY
        // INSERT, UPDATE, EXCLUDE
        if (setupStatus.success && setupStatus.data) {
          await this.insertionHandleService.run(payload, setupStatus.data);
        }
      }
      // Log the final payload
      console.log(payload);
      return payload;
    } catch (error) {
      // If any general error occurs, update payload and return
      payload.updateStatus({
        step: 'General',
        success: false,
        error: error.message,
      });
      return payload;
    }
  }
}
