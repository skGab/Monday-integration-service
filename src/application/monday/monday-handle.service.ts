import {
  ResponseFactory,
  ServiceResponse,
} from '../../domain/factory/response-factory';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { MondayRepository } from 'src/domain/repository/monday-repository';
import { Workspace } from 'src/domain/entities/board/workspace';
import { MondayResponseVo } from 'src/domain/valueObjects/monday-response.vo';

@Injectable()
export class MondayHandleService {
  constructor(private mondayRepositoryService: MondayRepository) {}

  async run(): Promise<MondayResponseVo> {
    // GET MONDAY BOARDS
    const { data: mondayBoards, error: boardsError } = await this.getBoards();

    if (boardsError) {
      throw boardsError;
    }

    // GET MONDAY WORKSPACES
    const { data: mondayWorkspaces, error: workspacesError } =
      await this.getWorkspaces();

    if (workspacesError) {
      throw workspacesError;
    }

    // RETURN MONDAY DATA
    const mondayResponse: MondayResponseVo = {
      data: {
        boards: mondayBoards,
        workspaces: mondayWorkspaces,
      },
    };

    return mondayResponse;
  }

  // GET MONDAY BOARDS
  async getBoards(): Promise<ServiceResponse<Board[]>> {
    const mondayBoards = this.mondayRepositoryService.getBoards();

    return ResponseFactory.run(mondayBoards);
  }

  // GET MONDAY WORKSPACES
  async getWorkspaces(): Promise<ServiceResponse<Workspace[]>> {
    const workspaces = this.mondayRepositoryService.getWorkSpaces();

    return ResponseFactory.run(workspaces);
  }
}
