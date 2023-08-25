import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { TransferBoards } from '../usecases/transfer-boards.usecase';
import { GetBoardsDto } from '../dto/get-boards.dto';

@Controller('boards')
export class BoardController {
  constructor(private transferBoards: TransferBoards) {}

  @Get()
  async getBoards(): Promise<GetBoardsDto[]> {
    try {

      

      const boards = await this.transferBoards.run();

      return boards;
    } catch (error) {}
  }

  // @Post()
  // transfer() {
  //   try {
  //     // return this.transferBoards.execute();
  //   } catch (error) {}
  // }
}
