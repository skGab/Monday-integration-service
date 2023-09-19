import { CallApiService } from './call-api.service';
import { Injectable, Logger } from '@nestjs/common';
import { BoardVo } from 'src/domain/board/board-vo';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MondayRepositoryService {
  private logger = new Logger(MondayRepositoryService.name);

  constructor(private callApiService: CallApiService) {}

  async getBoards(): Promise<BoardVo[] | null> {
    try {
      const { data } = await lastValueFrom(this.callApiService.run());

      const {
        data: { boards },
      } = data;

      return boards;
    } catch (error) {
      return null;
      this.logger.error(error);
    }
  }

  async getWorkSpaces(): Promise<WorkspaceVo[] | null> {
    try {
      const { data } = await lastValueFrom(this.callApiService.run());

      const {
        data: { workspaces },
      } = data;

      return workspaces;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
