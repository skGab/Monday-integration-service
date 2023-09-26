import { TransferUsecase } from './../usecase/transfer-usecase.service';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Controller('boards')
export class BoardController {
  logger = new Logger(BoardController.name);

  constructor(
    // private schedulerService: SchedulerService,
    private transferUsecase: TransferUsecase,
  ) {}

  // SERVICE LOGS
  @Get('logs')
  async transferBoardsToBigQuery() {
    try {
      // const status = this.schedulerService.getCurrentStatus();
      const status = this.transferUsecase.run();

      if (status === null)
        // COLOCAM NA LIB DE ERROR
        return 'Algo aconteceu durante a busca de dados no Monday';

      return status;
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error durante a transferencia de quadros',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
