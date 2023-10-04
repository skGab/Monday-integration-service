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
    const mondayBoards = await this.mondayRepositoryService.getBoards();

    // RETURNING NULL IF ANY BOARDS FOUND
    if (!mondayBoards) {
      return ResponseFactory.run(Promise.resolve(null));
    }

    // SANITIZING BOARDS BEFORE SENDING IT
    const { validBoards } = this.sanitize(mondayBoards);

    return ResponseFactory.run(Promise.resolve(validBoards));
  }

  // GET MONDAY WORKSPACES
  async getWorkspaces(): Promise<ServiceResponse<Workspace[] | null>> {
    const workspaces = this.mondayRepositoryService.getWorkSpaces();

    // RETURNING NULL IF ANY WORKSPACES FOUND
    if (!workspaces) return ResponseFactory.run(Promise.resolve(null));

    return ResponseFactory.run(workspaces);
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
