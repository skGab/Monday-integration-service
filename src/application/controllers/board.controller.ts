import { TransferUseCase } from './../usecases/transfer-usecase';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { GetUseCase } from '../usecases/get-usecase';
import { GetBoardsDto } from '../dto/get-boards.dto';
import { TransferBoardsDto } from '../dto/transfer-boards.dto';
import { ErrorHandlingService } from '../services/error-handling.service';

@Controller('boards')
export class BoardController {
  private readonly logger = new Logger(BoardController.name);

  constructor(
    // private transferBoards: TransferBoards,
    private getUseCase: GetUseCase, // private transferUseCase: TransferUseCase,
    readonly errorHandling: ErrorHandlingService,
  ) {}

  // @Post()
  // async transferBoardsToBigQuery(): Promise<TransferBoardsDto[]> {
  //   try {
  //     const boards = await this.transferUseCase.run();
  //     return boards;
  //   } catch (error) {}
  // }

  @Get()
  async getMondayBoards(): Promise<GetBoardsDto[]> {
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
