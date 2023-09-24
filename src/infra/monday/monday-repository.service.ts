import { EntityFactory } from './../../domain/board/entity-factory';
import { CallApiService } from './call-api.service';
import { Injectable, Logger } from '@nestjs/common';
import { Workspace } from 'src/domain/board/entities/workspace';
import { lastValueFrom } from 'rxjs';
import { Board } from 'src/domain/board/entities/board';

@Injectable()
export class MondayRepositoryService {
  private logger = new Logger(MondayRepositoryService.name);
  readonly EntityFactory = EntityFactory;

  constructor(private callApiService: CallApiService) {}

  async getBoards(): Promise<Board[] | null> {
    try {
      const { data } = await lastValueFrom(this.callApiService.run());

      const {
        data: { boards },
      } = data;

      if (!boards || boards.length === 0) {
        // PUT ON JSON FILE WITH LOGGING LIB
        this.logger.error('Nenhum quadro encontrado durante a busca');
        return null;
      }

      return boards.map((board) => EntityFactory.createBoard(board));
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getWorkSpaces(): Promise<Workspace[] | null> {
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

      return workspaces.map(EntityFactory.createWorkspace);
    } catch (error) {
      // PUT ON JSON FILE WITH LOGGING LIB
      this.logger.error(error);
      return null;
    }
  }
}
