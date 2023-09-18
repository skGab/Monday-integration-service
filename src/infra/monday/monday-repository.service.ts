import { Injectable } from '@nestjs/common';
import { MondayService } from './monday.service';
import { BoardVo } from 'src/domain/board/board-vo';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';

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
