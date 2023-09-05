import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GetUseCase } from '../usecases/get-usecase';
import { GetBoardsDto } from '../dto/get-boards.dto';
import { EventHandleService } from '../events/event-handle.service';

@Controller('boards')
export class BoardController {
  private readonly logger = new Logger(BoardController.name);

  constructor(
    // private transferBoards: TransferBoards,
    private getUseCase: GetUseCase, // private transferUseCase: TransferUseCase,
    readonly errorHandling: EventHandleService,
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
