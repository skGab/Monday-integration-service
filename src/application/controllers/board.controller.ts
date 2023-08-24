import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { TransferBoards } from '../usecases/transfer-boards.usecase';
import { GetBoardsDto } from '../dto/get-boards.dto';

@Controller('boards')
export class BoardController {
  constructor(private transferBoards: TransferBoards) {}

  @Get()
  getBoards() {
    try {
      const boards = this.transferBoards.run();

      return {
        boards,
      };
    } catch (error) {}
  }

  // @Post()
  // transfer() {
  //   try {
  //     // return this.transferBoards.execute();
  //   } catch (error) {}
  // }
}
