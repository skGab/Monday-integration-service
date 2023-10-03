import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PipeLineOrchestratorUsecase } from '../usecase/pipeLine-orchestrator.service';
import { OnEvent } from '@nestjs/event-emitter';

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
  async transferBoardsToBigQuery() {
    try {
      // const status = this.schedulerService.getCurrentStatus();
      const status = await this.pipeLineOrchestratorUsecase.run();

      return status;
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error durante a transferencia de quadros',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  // TRATAÇÃO DE ERRROS
  @OnEvent('infraError')
  handleErrors(payload: any) {
    this.logger.error(payload);
  }
}
