import { EntityFactory } from '../../domain/factory/entity-factory';
import { Injectable, Logger } from '@nestjs/common';
import { Workspace } from 'src/domain/entities/board/workspace';
import { lastValueFrom } from 'rxjs';
import { Board } from 'src/domain/entities/board/board';
import { ApiCallService } from './api/api-call.service';

@Injectable()
export class MondayRepositoryService {
  private logger = new Logger(MondayRepositoryService.name);

  constructor(private apiCallService: ApiCallService) {}

  async getBoards(): Promise<Board[] | null> {
    const { data } = await lastValueFrom(this.apiCallService.run());

    const {
      data: { boards },
    } = data;

    if (!boards || boards.length === 0) {
      this.logger.log('Nenhum quadro encontrado durante a busca');
      return null;
    }

    return boards.map((board) => EntityFactory.createBoard(board));
  }

  async getWorkSpaces(): Promise<Workspace[] | null> {
    const { data } = await lastValueFrom(this.apiCallService.run());

    const {
      data: { workspaces },
    } = data;

    if (workspaces.length == 0 || !workspaces) {
      this.logger.log('Nenhuma area de trabalho encontrada durante a busca');
      return null;
    }

    const response = workspaces
      .map((workspace) => EntityFactory.createWorkspace(workspace))
      .filter((workspace) => workspace !== null);

    return response;
  }
}
