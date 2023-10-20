import { BoardsJobHandleService } from './../handles/boardsJob-handle.service';
import { WorkspacesJobHandleService } from './../handles/workspacesJob-handle.service';
import { ItemsJobHandleService } from './../handles/itemsJob-handle.service';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from 'src/application/dtos/core/payload.dto';
import { promisify } from 'util';

@Injectable()
export class PipeLineOrchestratorUsecase {
  private isRunning = false; // Add the flag

  constructor(
    private itemsJobHandleService: ItemsJobHandleService,
    private workspacesJobHandleService: WorkspacesJobHandleService,
    private boardsJobHandleService: BoardsJobHandleService,
  ) {}

  async run(): Promise<PayloadDto> {
    // if (this.isRunning) {
    //   console.log('Another process is currently running. Please wait.');
    //   return;
    // }

    // this.isRunning = true;

    // try {
    // GETTING DATA
    const { datasetJobStatusDto, tableJobStatusDto, itemJobStatusDto } =
      await this.queuingJobs();

    // INSTANCIA DO PAYLOAD
    const payload = new PayloadDto(
      datasetJobStatusDto,
      tableJobStatusDto,
      itemJobStatusDto,
    );

    console.dir(payload, { depth: 4 });
    // console.log(payload);
    return payload;
    // } catch (error) {
    //   console.error('An error occurred:', error);
    // } finally {
    //   this.isRunning = false;
    // }
  }

  // GETTING DATA
  private async queuingJobs() {
    const delay = promisify(setTimeout);

    console.log('--------------------');
    console.log('Iniciando Dataset Job');
    console.log('--------------------');

    // DATASET JOB
    const datasetJobStatusDto = await this.workspacesJobHandleService.handle();

    console.log('--------------------');
    console.log('Iniciando Table Job');
    console.log('--------------------');

    // TABLE JOB
    const tableJobStatusDto = await this.boardsJobHandleService.handle();

    console.log('--------------------');
    console.log('Aguardando disponibilidade de tabelas...');
    console.log('--------------------');

    // Wait for 4 minutes
    await delay(240 * 1000);

    console.log('--------------------');
    console.log('Iniciando Items Job');
    console.log('--------------------');

    // ITEMS JOB
    const itemJobStatusDto = await this.itemsJobHandleService.handle(
      tableJobStatusDto.boardDto.data,
    );

    return { datasetJobStatusDto, tableJobStatusDto, itemJobStatusDto };
  }
}
