import { Injectable } from '@nestjs/common';
import { MondayRepository } from 'src/domain/repository/monday-repository';
import { MondayDto } from './monday.dto';
import { WorkspaceDto } from './workspace.dto';

@Injectable()
export class MondayHandleService {
  constructor(private mondayRepositoryService: MondayRepository) {}

  // GET MONDAY BOARDS
  async getBoards(): Promise<MondayDto> {
    try {
      const mondayBoards = await this.mondayRepositoryService.getBoards();

      // RETURNING NULL IF ANY BOARDS FOUND
      if (!mondayBoards) {
        const mondayDto = new MondayDto(
          null,
          [],
          0,
          'Nenhum Board Encontrado durante a busca',
        );

        return mondayDto;
      }

      const mondayDto = new MondayDto(
        mondayBoards,
        mondayBoards.map((board) => board.name),
        mondayBoards.length,
        'Success',
      );

      // RETURNING MONDAY VO
      return mondayDto;
    } catch (error) {
      // RETURNING MONDAY VO WITH ERROR
      const mondayDto = new MondayDto(null, [], 0, error);

      return mondayDto;
    }
  }

  // GET MONDAY WORKSPACES
  async getWorkspaces(): Promise<WorkspaceDto> {
    try {
      const workspaces = await this.mondayRepositoryService.getWorkSpaces();

      // RETURNING NULL IF ANY WORKSPACES FOUND
      if (!workspaces) {
        return new WorkspaceDto(
          null,
          [],
          0,
          'Nenhuma area de trabalho Encontrada durante a busca',
        );
      }

      // RETURNING MONDAY VO
      return new WorkspaceDto(
        workspaces,
        workspaces.map((workspaces) => workspaces.workspaceName()),
        workspaces.length,
        'Success',
      );
    } catch (error) {
      // RETURNING MONDAY VO WITH ERROR
      return new WorkspaceDto(null, [], 0, error.message);
    }
  }
}
