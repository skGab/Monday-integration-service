import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { TransferBoards } from '../usecases/transfer-boards.usecase';
import { GetBoardsDto } from '../dto/get-boards.dto';

@Controller('boards')
export class BoardController {
  constructor(private transferBoards: TransferBoards) {}

  @Get()
  getBoards(
    @Body() getBoardsDto: GetBoardsDto[],
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // res.status(HttpStatus.OK);
      return 'Ola';
    } catch (error) {}
  }

  @Post()
  transfer() {
    try {
      // return this.transferBoards.execute();
    } catch (error) {}
  }
}
