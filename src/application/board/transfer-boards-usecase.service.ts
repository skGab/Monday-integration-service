import { Injectable } from '@nestjs/common';
import { PrepareBoardsService } from './prepare-boards.service';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { PreparePayload } from './prepare-payload';

@Injectable()
export class TransferBoardsUsecase {
  // CONSTRUIR LOGICA DE ITEMS DUPLICADOS
  // CONSTRUIR LOGICA DE ATUALIZAÇÃO E EXCLUSÃO DE ITEMS, BOARDS E WORKSPACES

  private preparePayload: PreparePayload;

  constructor(
    private bigQueryRepository: BigQueryRepository,
    private prepareBoardsService: PrepareBoardsService,
  ) {
    this.preparePayload = new PreparePayload();
  }

  async run() {
    // SETUP BOARDS COLUMNS AND TABLES FOR TO BIGQUERY SPECIFICATION
    const { boardTablePairs } = await this.prepareBoardsService.run();

    // HANDLE BIGQUERY
    // INSERTING DATA
    const transferPromises = boardTablePairs.map(async ({ board, table }) => {
      // JA ESTOU PEGANDO OS ITEMS DO BIGQUERY AGORA PRECISO VERIFICAR OS DADOS NO CONSOLE E SEGUIR COM A VALIDAO
      // GET ITEMS FROM BIGQUERY
      const bigQueryItems = await this.bigQueryRepository.getItemsFromBoard(
        board,
      );

      // PREPARE
      const { duplicateItems, corePayload } = this.preparePayload.run(
        bigQueryItems,
        board,
      );

      return { duplicateItems, corePayload };

      // return this.bigQueryRepository.transferDataToBoard(payload, table);
    });
    // END HANDLE BIGQUERY

    // // WAITING FOR ALL THE INSERTIONS
    // const responses = await Promise.all(transferPromises);
    console.log(transferPromises);

    return transferPromises;
  }
}
