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
    try {
      const mondayBoards = await this.mondayRepositoryService.getBoards();

      if (!mondayBoards.length) {
        // payload.updateStatus({
        //   step: 'Busca de Quadros',
        //   success: false,
        //   error: 'Nenhum quadro encontrado durante a busca',
        // });
        return {
          success: false,
          error: 'Nenhum quadro encontrado durante a busca',
        };
      }

      // payload.addBoard(mondayBoards);

      // payload.updateStatus({
      //   step: 'Busca de Quadros',
      //   success: true,
      // });

      return ResponseFactory.createSuccess(mondayBoards);
    } catch (error) {
      // payload.updateStatus({
      //   step: 'Busca de Quadros',
      //   success: false,
      //   error: error.message,
      // });
      return ResponseFactory.createFailure(error.message);
    }
  }
}
