import { EntityFactory } from '../../domain/factory/entity-factory';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ApiCallService } from './api-call.service';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';

@Injectable()
export class MondayRepositoryService {
  private logger = new Logger(MondayRepositoryService.name);

  constructor(private apiCallService: ApiCallService) {}

  async getBoards(): Promise<BoardEntity[] | null> {
    const response = await lastValueFrom(this.apiCallService.run());

    if ('errors' in response.data) {
      this.logger.error(response.data.errors);
      throw response.data.errors[0].message;
    }

    const { boards } = response.data.data;

    if (!boards || boards.length === 0) {
      this.logger.log('Nenhum quadro encontrado durante a busca');
      return null;
    }

    return boards.map((board) => EntityFactory.createBoard(board));
  }

  async getWorkSpaces(): Promise<WorkspaceEntity[] | null> {
    const response = await lastValueFrom(this.apiCallService.run());

    if ('errors' in response.data) {
      this.logger.error(`GraphQL Error: ${response.data.errors[0].message}`);
      throw response.data.errors[0].message;
    }

    const { workspaces } = response.data.data;

    if (workspaces.length == 0 || !workspaces) {
      this.logger.log('Nenhuma area de trabalho encontrada durante a busca');
      return null;
    }

    return workspaces
      .map((workspace) => EntityFactory.createWorkspace(workspace))
      .filter((workspace) => workspace !== null);
  }
}
