import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PipeLineOrchestratorUsecase } from '../usecase/pipeLine-orchestrator.service';

interface ErrorEvent {
  type: 'serviceError' | 'infrastructureError';
  error: Error;
  source: string;
}

@Controller('boards')
export class BoardController {
  logger = new Logger(BoardController.name);

  constructor(
    // private schedulerService: SchedulerService,
    private pipeLineOrchestratorUsecase: PipeLineOrchestratorUsecase,
  ) {}

  // SERVICE LOGS
  @Get('logs')
  async syncData() {
    try {
      // const status = this.schedulerService.getCurrentStatus();
      const status = await this.pipeLineOrchestratorUsecase.run();

      return status;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error durante a integração de dados',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // // TRATAÇÃO DE ERRROS
  // @OnEvent('infraError')
  // handleErrors(payload: any) {
  //   this.logger.error(payload);
  // }
}
