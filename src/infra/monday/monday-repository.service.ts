import { CallApiService } from './call-api.service';
import { Injectable, Logger } from '@nestjs/common';
import { WorkspaceVo } from 'src/domain/board/workspace-vo';
import { lastValueFrom } from 'rxjs';
import { Board } from 'src/domain/board/board';

@Injectable()
export class MondayRepositoryService {
  private logger = new Logger(MondayRepositoryService.name);

  constructor(private callApiService: CallApiService) {}

  async getBoards(): Promise<Board[] | null> {
    try {
      const { data } = await lastValueFrom(this.callApiService.run());

      const {
        data: { boards },
      } = data;

      if (boards.length == 0 || !boards) {
        // PUT ON JSON FILE WITH LOGGING LIB
        this.logger.error('Nenhum quadro encontrado durante a busca');
        return null;
      }

      return boards;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getWorkSpaces(): Promise<WorkspaceVo[] | null> {
    try {
      const { data } = await lastValueFrom(this.callApiService.run());

      const {
        data: { workspaces },
      } = data;

      if (workspaces.length == 0 || !workspaces) {
        // PUT ON JSON FILE WITH LOGGING LIB
        this.logger.error(
          'Nenhuma area de trabalho encontrada durante a busca',
        );
        return null;
      }

      return workspaces;
    } catch (error) {
      // PUT ON JSON FILE WITH LOGGING LIB
      this.logger.error(error);
      return null;
    }
  }
}
