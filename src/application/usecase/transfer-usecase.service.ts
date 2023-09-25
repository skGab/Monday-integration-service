import { CreateWorkspaces } from './../services/bigQuery/create-workspaces.service';
import { Injectable } from '@nestjs/common';

import { FetchBoardsService } from '../services/fetch-boards.service';

import { BigQueryHandleService } from './handles/bigQuery-handle.service';
import { InsertionHandleService } from './handles/insertion-handle.service';

import { PayloadDto } from '../dto/payload.dto';

@Injectable()
export class TransferUsecase {
  constructor(
    private fechBoardsService: FetchBoardsService,
    private createWorkspaces: CreateWorkspaces,
    private insertionHandleService: InsertionHandleService,
    private bigQueryHandleService: BigQueryHandleService,
    private payload: PayloadDto,
  ) {}

  // PRECISO MELHORAR O PAYLOAD PARA O FRONT-END
  // PRECISO PADRONIZAR AS RESPOSTAS DOS SERVIÇOS COM O FACTORY JUNTO AO PAYLOAD
  // MONTAR LOGICA DE ATUALIZAÇÃO
  // MONTAR LOGICA DE EXCLUSÃO
  // DEPLOY DO FRONT-END COM AUTHENTICAÇÃO DO GOOGLE
  // TRATAÇÃO E VISUALIZAÇÃO DO PAYLOAD NO TERMINAL

  // PAYLOAD PODE SER ASSIM
  // POSSO RETORNAR DADOS DA INSERÇÃO COMO NUMERO DE NUMERO ITENS INSERIDOS, EXCLUIDOS E ATUALIZADOS
  // POSSO RETORNAR A ARRAY DE STATUS VINDO DE CADA RESPONSA DE SERVIÇO

  async run(): Promise<PayloadDto> {
    try {
      // CREATE DATASETS ON BIGQUERY AND UPDATE PAYLOAD
      await this.createWorkspaces.run(this.payload);

      // GET MONDAY BOARDS AND UPDATE PAYLOAD
      const boardsStatus = await this.fechBoardsService.run(this.payload);

      if (boardsStatus.success) {
        // CREATING TABLES FROM BOARDS ON BIGQUERY AND UPDATE THE PAYLOAD
        const setupStatus = await this.bigQueryHandleService.run(
          this.payload,
          boardsStatus.data,
        );

        // INSERTING
        await this.insertionHandleService.run(this.payload, setupStatus.data);
      } else {
      }

      // Log the final payload
      console.log(this.payload);
      return this.payload;
    } catch (error) {
      // If any general error occurs, update payload and return
      this.payload.updateStatus({
        step: 'General',
        success: false,
        error: error.message,
      });
      return this.payload;
    }
  }
}
