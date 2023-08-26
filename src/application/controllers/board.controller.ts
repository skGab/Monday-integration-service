import { Controller, Get, Post } from '@nestjs/common';
// import { TransferBoards } from '../usecases/transfer-usecase';
import { GetUseCase } from '../usecases/get-usecase';
import { GetBoardsDto } from '../dto/get-boards.dto';
// import { TransferBoardsDto } from '../dto/transfer-boards.dto';

@Controller('boards')
export class BoardController {
  constructor(
    // private transferBoards: TransferBoards,
    private getUseCase: GetUseCase,
  ) {}

  // @Post()
  // async transferBoards(): Promise<TransferBoardsDto[]> {
  //   try {
  //     const boards = await this.transferBoards.run();
  //     return boards;
  //   } catch (error) {}
  // }

  @Get()
  async getBoards(): Promise<GetBoardsDto[]> {
    try {
      const boards = await this.getUseCase.run();
      return boards;
    } catch (error) {}
  }
}
