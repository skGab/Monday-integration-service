import { Injectable } from '@nestjs/common';
import { GetBoardsDto } from '../dto/get-boards.dto';
import { GetBoardsService } from '../services/get-boards.service';

@Injectable()
export class GetUseCase {
  constructor(private getBoardsService: GetBoardsService) {}

  async run(): Promise<GetBoardsDto[]> {
    const boards = await this.getBoardsService.execute();
    return boards;
  }
}
