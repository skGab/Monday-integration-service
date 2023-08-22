import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { TransferMondayBoards } from '../usecases/transfer-monday-boards';
import { GetBoardsDto } from '../dto/boards/get-boards.dto';

@Controller('boards')
export class BoardController {
  constructor(private transferBoards: TransferMondayBoards) {}

  @Get()
  getBoards(
    @Body() getBoardsDto: GetBoardsDto[],
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // res.status(HttpStatus.OK);
      // return this.appService.getHello();
    } catch (error) {}
  }

  @Post()
  transfer() {
    try {
      return this.transferBoards.execute();
    } catch (error) {}
  }
}
