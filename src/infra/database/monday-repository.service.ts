import { Injectable } from '@nestjs/common';
import { BoardVo, WorkspaceVo } from 'src/domain/valueObjects/board-vo';
import { MondayService } from '../api/monday.service';

@Injectable()
export class MondayRepositoryService {
  constructor(private mondayService: MondayService) {}

  async getBoards(): Promise<BoardVo[] | null> {
    const {
      data: { boards },
    } = await this.mondayService.run();

    if (!boards) {
      return null;
    }

    return boards;
  }

  async getWorkSpaces(): Promise<WorkspaceVo[] | null> {
    const {
      data: { workspaces },
    } = await this.mondayService.run();

    if (!workspaces) {
      return null;
    }

    return workspaces;
  }
}
