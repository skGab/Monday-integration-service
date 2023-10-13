import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { PipeLineOrchestratorUsecase } from '../usecase/pipeLine-orchestrator.service';

interface ErrorEvent {
  type: 'serviceError' | 'infrastructureError';
  error: Error;
  source: string;
}

@Controller('boards')
export class IntegrationController {
  logger = new Logger(IntegrationController.name);

  constructor(
    // private schedulerService: SchedulerService,
    private pipeLineOrchestratorUsecase: PipeLineOrchestratorUsecase,
  ) {}

  // SERVICE LOGS
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('logs')
  async syncData() {
    try {
      // const status = this.schedulerService.getCurrentStatus();
      const status = await this.pipeLineOrchestratorUsecase.run();

      const response = {
        status: 200,
        message: 'Dados sincronizados',
      };

      return status ? response : 'Nenhum dado encontrado para sincronização';
      // return status;
    } catch (error) {
      // RETURNING INTERNAL ERROR TO THE CLIENT
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error durante a integração de dados',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
