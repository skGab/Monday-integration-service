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
    try {
      const response = await lastValueFrom(this.apiCallService.callBoards());

      if ('errors' in response.data) {
        this.logger.error(response.data.errors);
        return null;
      }

      const { boards } = response.data.data;

      if (!boards || boards.length === 0) {
        this.logger.log('Nenhum quadro encontrado durante a busca');
        return null;
      }

      // Filter boards where type is 'board'
      const filteredBoards = boards
        .filter((board) => board.type === 'board')
        .filter((board) => board.workspace !== null);

      if (filteredBoards.length === 0) {
        this.logger.log('No boards of type "board" found.');
        return null;
      }

      return filteredBoards.map((board) => EntityFactory.createBoard(board));
    } catch (error) {
      console.log(error);
    }
  }

  async getWorkSpaces(): Promise<WorkspaceEntity[] | null> {
    const response = await lastValueFrom(this.apiCallService.callWorkspaces());

    if ('errors' in response.data) {
      this.logger.error(`GraphQL Error: ${response.data.errors[0].message}`);
      return null;
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
