import { GetWorkspacesService } from './../bigQuery/workspace/get-workspaces.service';
import { DatasetDto, SharedShape } from './../dtos/bigQuery/dataset.dto';
import { MondayHandleService } from '../handles/monday-handle.service';
import { Injectable, Logger } from '@nestjs/common';

import { BigQueryHandleService } from '../handles/bigQuery-handle.service';
import { PayloadDto } from 'src/application/dtos/core/payload.dto';

@Injectable()
export class PipeLineOrchestratorUsecase {
  constructor(private bigQueryHandleService: BigQueryHandleService) {}

  async run(): Promise<PayloadDto> {
    // GETTING DATA
    const { datasetDto } = await this.queuingJobs();

    // INSTANCIA DO PAYLOAD
    const payload = new PayloadDto(datasetDto);

    console.log(payload);
    return payload;
  }

  // GETTING DATA
  private async queuingJobs() {
    //FINALIZAR ATUALIZAÇÃO DE DATASETS
    const datasetDto = await this.bigQueryHandleService.handleDatasetsJob();

    // INICIAR JOB DAS TABELAS

    return { datasetDto };
  }

  // // 2 - SEGUNDO JOB: HANDLE TABLES
  // // UPDATE IF NEEDED
  // private async handleTablesJob() {
  //   // GET MONDAY BOARDS
  //   const mondayDto = await this.mondayHandleService.getBoards();

  //   // CREATE TABLES IF NEEDED
  //   const tableDto = await this.bigQueryHandleService.createTables(
  //     mondayDto.data,
  //   );
  // }

  // // 3 - HANDLE TRANSFER
  // // GET ITEMS
  // // CREATE ITEMS ON TABLE IF NEEDED
  // // UPDATE ITEMS IF NEEDED
  // // DELETE ITEMS IF NEEDED
  // private async handleTransferJob() {
  //   const crudOperationsDto = await this.bigQueryHandleService.crudOperations(
  //     mondayDto.data,
  //     tableDto.data,
  //   );
  // }
}
