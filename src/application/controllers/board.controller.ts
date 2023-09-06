import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GetUseCase } from '../usecases/get-usecase';
import { EventHandleService } from '../events/event-handle.service';
import { Board } from 'src/domain/entities/board';
import { BoardDto } from '../dto/board.dto';

@Controller('boards')
export class BoardController {
  private readonly logger = new Logger(BoardController.name);

  constructor(
    private getUseCase: GetUseCase,
    private transferUseCase: TransferUseCase,
    readonly errorHandling: EventHandleService,
  ) {}

  @Post('transfer')
  async transferBoardsToBigQuery(): Promise<BoardDto[]> {
    try {
      const boards = await this.getUseCase.run();
      const response = await this.transferUseCase.run(boards);

      return response;
    } catch (error) {
      this.logger.error(error);

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
  async getBoardsFromMonday(): Promise<Board[]> {
    try {
      const boards = await this.getUseCase.run();
      return boards;
    } catch (error) {
      this.logger.error(error);

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
