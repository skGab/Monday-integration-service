import {
  ResponseFactory,
  ServiceResponse,
} from '../../domain/factory/response-factory';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { MondayRepository } from 'src/domain/repository/monday-repository';

@Injectable()
export class MondayHandleService {
  constructor(private mondayRepositoryService: MondayRepository) {}

  async run(): Promise<ServiceResponse<Board[]>> {
    const mondayBoards = this.mondayRepositoryService.getBoards();

    // payload.addBoard(mondayBoards);

    // payload.updateStatus({
    //   step: 'Busca de Quadros',
    //   success: true,
    // });

    return ResponseFactory.run(mondayBoards);
    // payload.updateStatus({
    //   step: 'Busca de Quadros',
    //   success: false,
    //   error: error.message,
    // });
  }
}
