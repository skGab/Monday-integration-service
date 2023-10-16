import { BoardsJobHandleService } from './../handles/boardsJob-handle.service';
import { WorkspacesJobHandleService } from './../handles/workspacesJob-handle.service';
import { ItemsJobHandleService } from './../handles/itemsJob-handle.service';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from 'src/application/dtos/core/payload.dto';

@Injectable()
export class PipeLineOrchestratorUsecase {
  constructor(
    private itemsJobHandleService: ItemsJobHandleService,
    private workspacesJobHandleService: WorkspacesJobHandleService,
    private boardsJobHandleService: BoardsJobHandleService,
  ) {}

  async run(): Promise<PayloadDto> {
    // GETTING DATA
    const { datasetJobStatusDto, tableJobStatusDto } = await this.queuingJobs();

    // INSTANCIA DO PAYLOAD
    const payload = new PayloadDto(datasetJobStatusDto, tableJobStatusDto);

    console.dir(payload, { depth: null });
    // console.log(payload);
    return payload;
  }

  // GETTING DATA
  private async queuingJobs() {
    // WHEM THE REQUEST ARRIVES THIS TASK JOB SHOULD RUN FIRST,  WHEM COMPLETED
    // SHOULD RUN THE NEXT JOB AFTER 2 MINUTES, WHEN COMPLETE
    // SHOULD RUN THE LAST JOB AFTER 2 MINUTES

    // WHAT ABOUT ANOTHER REQUEST COMES WHEM PERFOMING THE JOBS ?

    // IMPLEMENTAR O SERVICO DE UPDATE DE TABELAS LA NO INFRA E DEPOIS PROSSEGUIR PARA OS ITEMS

    // DATASET JOB
    const datasetJobStatusDto =
      await this.workspacesJobHandleService.handleDatasetsJob();
    // TABLE JOB
    const tableJobStatusDto =
      await this.boardsJobHandleService.handleTablesJob();

    // ITEMS JOB
    // const itemsDto = await this.itemsJobHandleService.handleItemsJob();

    return { datasetJobStatusDto, tableJobStatusDto };
  }
}
