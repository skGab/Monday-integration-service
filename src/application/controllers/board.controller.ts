import { TransferUseCase } from './../usecases/transfer-usecase';
import { Controller, Get, Post } from '@nestjs/common';
import { GetUseCase } from '../usecases/get-usecase';
import { GetBoardsDto } from '../dto/get-boards.dto';
import { TransferBoardsDto } from '../dto/transfer-boards.dto';

@Controller('boards')
export class BoardController {
  constructor(
    // private transferBoards: TransferBoards,
    private getUseCase: GetUseCase,
    private transferUseCase: TransferUseCase,
  ) {}

  @Post()
  async transferBoardsToBigQuery(): Promise<TransferBoardsDto[]> {
    try {
      const boards = await this.transferUseCase.run();
      return boards;
    } catch (error) {}
  }

  @Get()
  async getMondayBoards(): Promise<GetBoardsDto[]> {
    try {
      const boards = await this.getUseCase.run();
      return boards;
    } catch (error) {}
  }
}
