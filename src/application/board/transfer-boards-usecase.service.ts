import { Injectable } from '@nestjs/common';
import { PrepareBoardsService } from './prepare-boards.service';

@Injectable()
export class TransferBoardsUsecase {
  // CONSTRUIR LOGICA DE ITEMS DUPLICADOS
  // CONSTRUIR LOGICA DE ATUALIZAÇÃO E EXCLUSÃO DE ITEMS, BOARDS E WORKSPACES

  constructor(private prepareBoardsService: PrepareBoardsService) {}

  async run() {
    // SETUP BOARDS COLUMNS AND TABLES FOR TO BIGQUERY SPECIFICATION
    const { transferPromises } = await this.prepareBoardsService.run();

    // // WAITING FOR ALL THE INSERTIONS
    const responses = await Promise.all(transferPromises);

    return responses;
  }
}
