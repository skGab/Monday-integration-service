import { EntityFactory } from '../../../domain/factory/entity-factory';
import { Injectable, Logger } from '@nestjs/common';
import { Workspace } from 'src/domain/entities/board/workspace';
import { lastValueFrom } from 'rxjs';
import { Board } from 'src/domain/entities/board/board';
import { ApiCallService } from '../api/api-call.service';

@Injectable()
export class MondayRepositoryService {
  private logger = new Logger(MondayRepositoryService.name);

  constructor(private apiCallService: ApiCallService) {}

  async getBoards(): Promise<Board[]> {
    try {
      const { data } = await lastValueFrom(this.apiCallService.run());

      const {
        data: { boards },
      } = data;

      if (!boards || boards.length === 0)
        throw Error('Nenhum quadro encontrado durante a busca');

      return boards.map((board) => EntityFactory.createBoard(board));
    } catch (error) {
      throw error;
    }
  }

  async getWorkSpaces(): Promise<Workspace[]> {
    try {
      const { data } = await lastValueFrom(this.apiCallService.run());

      const {
        data: { workspaces },
      } = data;

      if (workspaces.length == 0 || !workspaces)
        throw Error('Nenhuma area de trabalho encontrada durante a busca');

      const response = workspaces
        .map((workspace) => EntityFactory.createWorkspace(workspace))
        .filter((workspace) => workspace !== null);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
