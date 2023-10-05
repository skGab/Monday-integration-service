import {
  ResponseFactory,
  ServiceResponse,
} from '../../domain/factory/response-factory';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { MondayRepository } from 'src/domain/repository/monday-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import { ServiceStatusVo } from 'src/domain/valueObjects/service-status.vo';
import { BodyShape } from 'src/domain/entities/payload';

@Injectable()
export class MondayHandleService {
  constructor(private mondayRepositoryService: MondayRepository) {}

  // GET MONDAY BOARDS
  async getBoards(): Promise<ServiceResponse<Board[] | null>> {
    try {
      const mondayBoards = await this.mondayRepositoryService.getBoards();

      // RETURNING NULL IF ANY BOARDS FOUND
      if (!mondayBoards === null || mondayBoards instanceof Error) {
        return {
          data: null,
          error: mondayBoards instanceof Error ? mondayBoards : undefined,
        };
      }

      // SANITIZING BOARDS BEFORE SENDING IT
      const { validBoards } = this.sanitize(mondayBoards);

      return ResponseFactory.run(Promise.resolve(validBoards));
    } catch (error) {
      console.log('Get Boards method', error.message);
      return ResponseFactory.run(Promise.reject(error.message));
    }
  }

  // GET MONDAY WORKSPACES
  async getWorkspaces(): Promise<ServiceResponse<Workspace[] | null>> {
    try {
      const workspaces = this.mondayRepositoryService.getWorkSpaces();

      // RETURNING NULL IF ANY WORKSPACES FOUND
      if (!workspaces === null || workspaces instanceof Error) {
        return {
          data: null,
          error: workspaces instanceof Error ? workspaces : undefined,
        };
      }

      return ResponseFactory.run(workspaces);
    } catch (error) {
      console.log('Get Workspaces method', error.message);
      return ResponseFactory.run(Promise.resolve(null));
    }
  }

  // SANITIZE
  private sanitize(mondayBoards: Board[]) {
    const validBoards = mondayBoards.map((board) => {
      board.items = board.items.map((item) => {
        return item.sanitize();
      });
      return board;
    });

    return { validBoards };
  }
}
