import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TransferBoardsUsecase } from '../usecase/transfer-boards-usecase.service';

@Controller('boards')
export class BoardController {
  logger = new Logger(BoardController.name);

  constructor(private transferBoardsUseCase: TransferBoardsUsecase) {}

  @Get('transfer')
  async transferBoardsToBigQuery() {
    try {
      const workspaces =
        await this.transferBoardsUseCase.createBigQueryWorkSpaces();

      return workspaces;
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error durante a transferencia de quadros',
        },

        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  // SERVICE LOGS
  @Get('logs')
  async getBoardsFromMonday() {
    try {
      const boards = await this.transferBoardsUseCase.run();

      return boards;
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error durante a busca de quadros',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
