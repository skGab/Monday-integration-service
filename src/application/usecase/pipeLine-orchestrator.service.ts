import { Injectable } from '@nestjs/common';
import { BigQueryHandleService } from '../handles/bigQuery-handle.service';
import { PayloadDto } from 'src/application/dtos/core/payload.dto';

@Injectable()
export class PipeLineOrchestratorUsecase {
  constructor(private bigQueryHandleService: BigQueryHandleService) {}

  async run(): Promise<PayloadDto> {
    // GETTING DATA
    const { datasetJobStatusDto, tableJobStatusDto } = await this.queuingJobs();

    // INSTANCIA DO PAYLOAD
    const payload = new PayloadDto(datasetJobStatusDto, tableJobStatusDto);

    // console.dir(payload, { depth: null });
    console.log(payload);
    return payload;
  }

  // GETTING DATA
  private async queuingJobs() {
    // WHEM THE REQUEST ARRIVES THIS TASK JOB SHOULD RUN FIRST,  WHEM COMPLETED
    // SHOULD RUN THE NEXT JOB AFTER 2 MINUTES, WHEN COMPLETE
    // SHOULD RUN THE LAST JOB AFTER 2 MINUTES

    // WHAT ABOUT ANOTHER REQUEST COMES WHEM PERFOMING THE JOBS ?

    // NOW I NEED TO GET THE DATA IM RETURNING AND DO THE OPERATIONS

    // THEM CONTINUE TO ITEMS  HANDLE

    // DATASET JOB
    const datasetJobStatusDto =
      await this.bigQueryHandleService.handleDatasetsJob();

    // TABLE JOB
    const tableJobStatusDto =
      await this.bigQueryHandleService.handleTablesJob();

    // ITEMS JOB
    // const itemsDto = await this.bigQueryHandleService.handleItemsJob();

    return { datasetJobStatusDto, tableJobStatusDto };
  }
}
